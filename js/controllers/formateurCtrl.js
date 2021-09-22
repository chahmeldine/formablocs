
const itemId = localStorage.getItem('itemId');
const sectionBloc = document.querySelector('.sectionformation5')
const displayBlocById = () => {
    fbHelper.getBlocs(sectionBloc, itemId);
}

displayBlocById();