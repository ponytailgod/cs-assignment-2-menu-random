const form = document.getElementById("taskForm");
const resultCard = document.getElementById("resultCard");

const resultTitle = document.getElementById("resultTitle");
const riskLabel = document.getElementById("riskLabel");
const remainingHoursText = document.getElementById("remainingHours");
const daysLeftText = document.getElementById("daysLeft");
const riskScoreText = document.getElementById("riskScore");
const todayWorkText = document.getElementById("todayWork");
const adviceText = document.getElementById("advice");

const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

let tasks = [];
let currentCalendarDate = new Date();
currentCalendarDate.setDate(1);

function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getDateFromInput(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getRiskInfo(riskScore) {
  if (riskScore <= 0.5) {
    return {
      status: "안전",
      className: "safe",
      chipClass: "chip-safe",
      advice:
        "현재는 여유가 있는 상태입니다. 그래도 오늘 조금이라도 진행하면 마감 직전 부담을 줄일 수 있습니다.",
    };
  }

  if (riskScore <= 1.0) {
    return {
      status: "주의",
      className: "caution",
      chipClass: "chip-caution",
      advice:
        "아직 감당 가능한 수준이지만 미루면 위험해질 수 있습니다. 오늘 권장 작업량만큼은 진행하는 것이 좋습니다.",
    };
  }

  if (riskScore <= 1.5) {
    return {
      status: "위험",
      className: "danger",
      chipClass: "chip-danger",
      advice:
        "남은 작업량에 비해 시간이 부족한 편입니다. 오늘부터 우선순위를 높여서 집중적으로 진행해야 합니다.",
    };
  }

  return {
    status: "긴급",
    className: "emergency",
    chipClass: "chip-emergency",
    advice:
      "마감 위험도가 매우 높습니다. 오늘 바로 시작하고, 핵심 부분부터 빠르게 처리해야 합니다.",
  };
}

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  calendarTitle.textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty-cell";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const tasksForDay = tasks.filter((task) => task.deadlineString === dateKey);

    tasksForDay.forEach((task) => {
      const taskChip = document.createElement("span");
      taskChip.className = `task-chip ${task.chipClass}`;
      taskChip.textContent = `${task.name} · ${task.status}`;
      cell.appendChild(taskChip);
    });

    calendarGrid.appendChild(cell);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value.trim();
  const deadlineValue = document.getElementById("deadline").value;
  const totalHours = Number(document.getElementById("totalHours").value);
  const progress = Number(document.getElementById("progress").value);
  const difficulty = Number(document.getElementById("difficulty").value);
  const dailyHours = Number(document.getElementById("dailyHours").value);

  const today = getToday();
  const deadline = getDateFromInput(deadlineValue);

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

  const riskInfo = getRiskInfo(riskScore);

  resultTitle.textContent = taskName;
  riskLabel.textContent = `위험도 상태: ${riskInfo.status}`;
  remainingHoursText.textContent = `${remainingHours.toFixed(1)}시간`;
  daysLeftText.textContent = daysLeft === 0 ? "오늘 마감" : `${daysLeft}일`;
  riskScoreText.textContent = riskScore.toFixed(2);
  todayWorkText.textContent = `${todayWork.toFixed(1)}시간`;
  adviceText.textContent = riskInfo.advice;

  resultCard.classList.remove("hidden", "safe", "caution", "danger", "emergency");
  resultCard.classList.add(riskInfo.className);

  tasks.push({
    name: taskName,
    deadlineString: deadlineValue,
    status: riskInfo.status,
    chipClass: riskInfo.chipClass,
  });

  currentCalendarDate = new Date(deadline);
  currentCalendarDate.setDate(1);

  renderCalendar();
});

prevMonthButton.addEventListener("click", function () {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", function () {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();