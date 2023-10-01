// JavaScript code to display the selected value for each control
const sliders = document.querySelectorAll('input[type="range"]');
const selectedValues = document.querySelectorAll('.selectedValue');

sliders.forEach((slider, index) => {
    selectedValues[index].textContent = slider.value;
    slider.addEventListener('input', function () {
        selectedValues[index].textContent = slider.value;
    });
});