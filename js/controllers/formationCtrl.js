
const sectionFormations = document.querySelector('.sectionformation');

const displayFomations = () => {
    fbHelper.getFormations(sectionFormations);
}

displayFomations();