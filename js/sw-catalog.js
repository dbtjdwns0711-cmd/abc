/**
 * 기상 조건별 작업불능 상세 판정 기준 (코랩 정밀 분석 모델)
 */
const WEATHER_CRITERIA = {
  workHours: { start: 7, end: 17, totalHours: 10 },
  rain: {
    minHourly: 1.0,        // 시간당 1.0mm 이상
    consecutiveHours: 2,   // 2시간 연속 발생 시
    lossDay: 0.5           // 반일 오프 (오전/오후)
  },
  wind: {
    threshold: 15.0,       // 순간/시간 풍속 15.0m/s 이상
    lossDay: 0.5           // 반일 중지
  },
  heat: {
    mildThreshold: 35.0,   // 체감온도 35.0°C 이상
    severeThreshold: 38.0, // 체감온도 38.0°C 이상
    mildLossDay: 0.35,     // 14시~17시 중지 (경량 손실)
    severeLossDay: 1.0     // 당일 전일 중지 (중증 손실)
  },
  cold: {
    minTempThreshold: -12.0, // 일 최저기온 -12.0°C 이하
    lossDay: 1.0             // 당일 전일 중지
  },
  snow: {
    depthThreshold: 5.0,   // 일 최고 적설량 5.0cm 이상
    lossDay: 1.0           // 당일 전일 중지
  }
};

window.WEATHER_CRITERIA = WEATHER_CRITERIA;