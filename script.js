const form = document.getElementById("taskForm");
const resultCard = document.getElementById("resultCard");

const resultTitle = document.getElementById("resultTitle");
const riskLabel = document.getElementById("riskLabel");
const remainingHoursText = document.getElementById("remainingHours");
const daysLeftText = document.getElementById("daysLeft");
const riskScoreText = document.getElementById("riskScore");
const todayWorkText = document.getElementById("todayWork");
const adviceText = document.getElementById("advice");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const deadline = new Date(document.getElementById("deadline").value);
  const totalHours = Number(document.getElementById("totalHours").value);
  const progress = Number(document.getElementById("progress").value);
  const difficulty = Number(document.getElementById("difficulty").value);
  const dailyHours = Number(document.getElementById("dailyHours").value);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const oneDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((deadline - today) / oneDay);

  if (daysLeft < 0) {
    alert("이미 지난 마감일입니다. 마감일을 다시 선택해주세요.");
    return;
  }

  const remainingHours = totalHours * (1 - progress / 100);
  const availableDays = Math.max(daysLeft, 1);
  const availableHours = availableDays * dailyHours;

  const riskScore = (remainingHours / availableHours) * difficulty;
  const todayWork = remainingHours / availableDays;

  let status = "";
  let advice = "";
  let className = "";

  if (riskScore <= 0.5) {
    status = "안전";
    advice = "현재는 여유가 있는 상태입니다. 그래도 오늘 조금이라도 진행하면 마감 직전 부담을 줄일 수 있습니다.";
    className = "safe";
  } else if (riskScore <= 1.0) {
    status = "주의";
    advice = "아직 감당 가능한 수준이지만 미루면 위험해질 수 있습니다. 오늘 권장 작업량만큼은 진행하는 것이 좋습니다.";
    className = "caution";
  } else if (riskScore <= 1.5) {
    status = "위험";
    advice = "남은 작업량에 비해 시간이 부족한 편입니다. 오늘부터 우선순위를 높여서 집중적으로 진행해야 합니다.";
    className = "danger";
  } else {
    status = "긴급";
    advice = "마감 위험도가 매우 높습니다. 오늘 바로 시작하고, 필요하면 과제 범위를 나누어 핵심 부분부터 처리해야 합니다.";
    className = "emergency";
  }

  resultTitle.textContent = taskName;
  riskLabel.textContent = `위험도 상태: ${status}`;
  remainingHoursText.textContent = `${remainingHours.toFixed(1)}시간`;
  daysLeftText.textContent = daysLeft === 0 ? "오늘 마감" : `${daysLeft}일`;
  riskScoreText.textContent = riskScore.toFixed(2);
  todayWorkText.textContent = `${todayWork.toFixed(1)}시간`;
  adviceText.textContent = advice;

  resultCard.classList.remove("hidden", "safe", "caution", "danger", "emergency");
  resultCard.classList.add(className);
});