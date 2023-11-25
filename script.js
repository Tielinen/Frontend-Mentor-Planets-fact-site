"use strict";

// Query DOM elements
const body = document.querySelector('body');
const headerMenuIcon = document.querySelector('.header__hamburger-menu');
const headerMobileMenu  = document.querySelector('.header__mobile-menu');
const factButtons = document.querySelectorAll('.header__button-item');
const mobileMenuItems = document.querySelectorAll('.header__mobile-menu-item');
const menuItems = document.querySelectorAll('.header__menu-item');
const mainTitle = document.querySelector('.main__title');
const mainParagraph = document.querySelector('.main__paragraph');
const mainLink = document.querySelector('.main__link');
const mainImage = document.querySelector('.main__image');
const mainImageGeology = document.querySelector('.main__image-geology');
const factsValues = document.querySelectorAll('.facts__value');
const mainSourceLink = document.querySelector('.main__soucre-link')

// Data variables
let planetsData;
let currentPlanetData;
let selection = 'overview';

// Fetch data and set up the UI
fetchPlanetsData()
  .then(setupEventListeners)
  .catch(error => {
    console.error('There was an error fetching the data', error.message);
    // Handle the UI for errors here
  });

// function to fetch data
async function fetchPlanetsData() {
  const response = await fetch('/data.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  planetsData = await response.json();
  currentPlanetData = planetsData[0];
  updateContent();
}

// Function to setup event listeners
function setupEventListeners() {
  // Menu icon click event
  headerMenuIcon.addEventListener('click', toggleMobileMenu);

  // Fact buttons click events
  factButtons.forEach(button => {
    button.addEventListener('click', factButtonHandler);
  });

  // Mobile menu items click events 
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', mobileMenuItemHanlder)
  });

  menuItems.forEach(item => {
    item.addEventListener('click', mobileMenuItemHanlder)
  })
}

// Handlers for various events
function toggleMobileMenu(event) {
  headerMobileMenu.classList.toggle('display-none');
  body.classList.toggle('overflow-y-hidden');
  headerMenuIcon.classList.toggle('header__hamburger-menu--gray');
}

function factButtonHandler(event) {
  toggleActiveContentButton(event.target);
  selection = event.target.dataset.button;
  updateContent();
}

function mobileMenuItemHanlder(event) {
  currentPlanetData = planetsData.find(planetsData => 
    planetsData.name.toLowerCase() === event.currentTarget.dataset.planet.toLowerCase()
  );

  updateContent();
  if (event.currentTarget.classList.contains('header__mobile-menu-item')) {
    body.classList.toggle('overflow-y-hidden');
    headerMobileMenu.classList.add('display-none');
  }
}

function toggleActiveContentButton(element) {
  factButtons.forEach(button => {
    button.classList.remove('header__button-item--active');
  });
  element.classList.add('header__button-item--active');
}

// Update content based on current selection and data
function updateContent() {
  updateHeading();
  updateSoucreLink();
  updateParagraph();
  updateFactSection(currentPlanetData);
}

function updateHeading() {
  mainTitle.innerText = currentPlanetData.name;
}

function updateParagraph() {
  switch (selection) {
    case 'overview':
      mainImage.src = currentPlanetData.images.planet;
      mainImageGeology.classList.add('display-none');
      break
    case 'structure':
      mainImage.src = currentPlanetData.images.internal;
      mainImageGeology.classList.add('display-none');
      break
    case 'geology':
      mainImage.src = currentPlanetData.images.planet;
      mainImageGeology.src = currentPlanetData.images.geology;
      mainImageGeology.classList.remove('display-none'); 
  }
  mainParagraph.innerText = currentPlanetData[selection]['content'];
}

function updateSoucreLink() {
  mainSourceLink.href = currentPlanetData[selection]['source'];
}

function updateFactSection() {
  factsValues[0].innerText = currentPlanetData['rotation'];
  factsValues[1].innerText = currentPlanetData['revolution'];
  factsValues[2].innerText = currentPlanetData['radius'];
  factsValues[3].innerText = currentPlanetData['temperature'];
}