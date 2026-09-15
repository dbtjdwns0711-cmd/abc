/*---------------------------------------------------------
  calc.js - 기상 비작업일수 산정 엔진 (코랩 정밀 분석 모델 기반)
  기준: 주간(07~17시), 지속성 강우, 강풍, 폭염(체감온도), 한파, 적설
---------------------------------------------------------*/

/**
 * 기상청 여름철 습구체감온도(Tw) 및 체감온도 계산 함수
 * @param {number} ta - 기온(℃)
 * @param {number} rh - 상대습도(%)
 * @returns {number} 체감온도(℃)
 */
function calculateApparentTemp(ta, rh) {
  if (ta === undefined || ta === null) return null;
  const humidity = rh !== undefined && rh !== null ? rh : 50; // 습도 누락 시 기본 50%
  const tw = ta * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659))
           + Math.atan(ta + humidity)
           - Math.atan(humidity - 1.676331)
           + 0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity)
           - 4.686035;

  const apparentTemp = -0.2442
                     + 0.55399 * tw
                     + 0.45535 * ta
                     - 0.0022 * Math.pow(tw, 2)
                     + 0.00278 * tw * ta
                     + 3.0;

  return Math.round(apparentTemp * 10) / 10;
}

/**
 * 일자별 기상 데이터에 따른 작업 불능일수 판정 (코랩 정밀 분석 모델)
 * @param {Object} dayData - 당일 기상 관측/예보 데이터
 * @returns {Object} { lossDay: number, reason: string, detail: string }
 */
function evaluateWeatherLoss(dayData) {
  const criteria = window.WEATHER_CRITERIA || {
    rain: { minHourly: 1.0, consecutiveHours: 2, lossDay: 0.5 },
    wind: { threshold: 15.0, lossDay: 0.5 },
    heat: { mildThreshold: 35.0, severeThreshold: 38.0, mildLossDay: 0.35, severeLossDay: 1.0 },
    cold: { minTempThreshold: -12.0, lossDay: 1.0 },
    snow: { depthThreshold: 5.0, lossDay: 1.0 }
  };

  // 1. 혹한기 (한파): 당일 일 최저기온 -12.0℃ 이하 -> 전일 중지
  if (dayData.minTemp !== undefined && dayData.minTemp !== null && dayData.minTemp <= criteria.cold.minTempThreshold) {
    return { lossDay: criteria.cold.lossDay, reason: '혹한기(한파)', detail: `최저기온 ${dayData.minTemp}℃ (기준: ≤ -12.0℃)` };
  }

  // 2. 폭설 (적설): 당일 최고 적설량 5.0cm 이상 -> 전일 중지
  if (dayData.maxSnow !== undefined && dayData.maxSnow !== null && dayData.maxSnow >= criteria.snow.depthThreshold) {
    return { lossDay: criteria.snow.lossDay, reason: '폭설(적설)', detail: `최고적설 ${dayData.maxSnow}cm (기준: ≥ 5.0cm)` };
  }

  // 3. 혹서기 (폭염): 체감온도(Tw) 기준 판정
  let tw = dayData.maxTw;
  if ((tw === undefined || tw === null) && dayData.maxTemp !== undefined) {
    tw = calculateApparentTemp(dayData.maxTemp, dayData.avgHumidity || 50);
  }

  if (tw !== undefined && tw !== null) {
    if (tw >= criteria.heat.severeThreshold) {
      return { lossDay: criteria.heat.severeLossDay, reason: '폭염(중증)', detail: `체감온도 ${tw}℃ (기준: ≥ 38.0℃)` };
    }
    if (tw >= criteria.heat.mildThreshold) {
      return { lossDay: criteria.heat.mildLossDay, reason: '폭염(경량)', detail: `체감온도 ${tw}℃ (기준: ≥ 35.0℃)` };
    }
  }

  // 4. 강풍: 순간/시간 풍속 15.0m/s 이상 -> 반일 중지
  if (dayData.maxWind !== undefined && dayData.maxWind !== null && dayData.maxWind >= criteria.wind.threshold) {
    return { lossDay: criteria.wind.lossDay, reason: '강풍', detail: `풍속 ${dayData.maxWind}m/s (기준: ≥ 15.0m/s)` };
  }

  // 5. 지속성 강우: 2시간 연속 시간당 강수량 1.0mm 이상 -> 반일 중지
  const rainOccurred = dayData.rainConcur2Hours || 
                       (dayData.maxHourlyRain !== undefined && dayData.maxHourlyRain >= criteria.rain.minHourly && (dayData.rainDurationHours || 0) >= 2);
  if (rainOccurred) {
    return { lossDay: criteria.rain.lossDay, reason: '지속성 강우', detail: '2시간 연속 1.0mm 이상 관측' };
  }

  return { lossDay: 0, reason: '정상 작업', detail: '-' };
}

/**
 * 특정 기간 동안의 기상 비작업일수 집계
 * @param {Array} dailyList - 일자별 기상 데이터 목록
 * @returns {Object} { totalLossDays, rainDays, windDays, heatDays, coldDays, snowDays, details }
 */
function calculatePeriodWeatherLoss(dailyList) {
  let summary = {
    totalLossDays: 0,
    rainDays: 0,
    windDays: 0,
    heatDays: 0,
    coldDays: 0,
    snowDays: 0,
    details: []
  };

  if (!Array.isArray(dailyList)) return summary;

  dailyList.forEach(day => {
    const res = evaluateWeatherLoss(day);
    if (res.lossDay > 0) {
      summary.totalLossDays += res.lossDay;
      if (res.reason.includes('강우')) summary.rainDays += res.lossDay;
      else if (res.reason.includes('강풍')) summary.windDays += res.lossDay;
      else if (res.reason.includes('폭염')) summary.heatDays += res.lossDay;
      else if (res.reason.includes('한파')) summary.coldDays += res.lossDay;
      else if (res.reason.includes('적설') || res.reason.includes('폭설')) summary.snowDays += res.lossDay;
    }
    summary.details.push({
      date: day.date,
      ...res
    });
  });

  summary.totalLossDays = Math.round(summary.totalLossDays * 10) / 10;
  return summary;
}

// 전역 객체 등록
window.calculateApparentTemp = calculateApparentTemp;
window.evaluateWeatherLoss = evaluateWeatherLoss;
window.calculatePeriodWeatherLoss = calculatePeriodWeatherLoss;