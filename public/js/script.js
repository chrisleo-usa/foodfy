const openMenuBtn = document.querySelector('.openMenuButton');
const closeMenuBtn = document.querySelector('.closeMenuButton');
const mobileMenu = document.querySelector('.links');

if(openMenuBtn) {
  
  openMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('nav-active');
    openMenuBtn.classList.toggle('hide');
    closeMenuBtn.classList.toggle('hide');
  })

  closeMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('nav-active');
    openMenuBtn.classList.toggle('hide');
    closeMenuBtn.classList.toggle('hide');
  })
}

// === Menu active ===
const currentPage = location.pathname;
const menuItems = document.querySelectorAll('header .links a');
const adminItems = document.querySelectorAll('header .linksAdmin a');
for (item of menuItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

for (item of adminItems) {
  if (currentPage.includes(item.getAttribute('href'))) {
    item.classList.add('active');
  }
}

// === Recipe Wrapper ===
const content = document.querySelectorAll('.recipeInfo .content');
const buttons = document.querySelectorAll('.button');

for(let [i, button] of buttons.entries()) {
  button.addEventListener('click', () => {
    if(content[i].classList.contains('show')) {
      content[i].classList.remove('show');
      content[i].classList.add('hide');
      button.innerHTML= 'mostrar'
    } else {
      content[i].classList.add('show');
      content[i].classList.remove('hide');
      button.innerHTML= 'esconder';
    }
  });
};

// === Add Field ===
const buttonsAdd = document.querySelectorAll('#addField');

if(buttonsAdd) {
  buttonsAdd.forEach(btn => btn.addEventListener('click', cloneField => {

    const field = cloneField.target.parentNode;
    const fieldContainer = field.querySelector('.fieldContainer');
    const fieldItems = field.querySelectorAll('.fieldInput');
    const newFieldItem = fieldItems[fieldItems.length - 1].cloneNode(true);

    if(newFieldItem.value == '') return false;

    newFieldItem.value = '';

    return fieldContainer.appendChild(newFieldItem);
  }))
}

const PhotosUpload = {
  input: '',
  preview: document.querySelector('#photosPreview'),
  uploadLimit: '',
  files: [],
  handleFileInput(event, uploadLimit) {
    //Ao clicar no input e selecionar os arquivos ele coloca como files dentro do input, então estamos extraindo ele e chamando de fileList, que é um construtor de SOMENTE LEITURA!
    const { files: fileList } = event.target
    PhotosUpload.input = event.target
    PhotosUpload.uploadLimit = uploadLimit
    
    if(PhotosUpload.hasLimit(event)) return

    //transformando o fileList em um array.
    Array.from(fileList).forEach(file => {

      PhotosUpload.files.push(file)

      const reader = new FileReader()

      //quando estiver pronto, executar o código da função onload. 
      reader.onload = () => {
        
        const image = new Image() //mesma coisa que fazer no html <img/>
        image.src = String(reader.result)

        const div = PhotosUpload.getContainer(image)
        PhotosUpload.preview.appendChild(div)
      }

      //Para ler a função acima, ele só ficará pronto quando ler o código abaixo. Após ler, executará o código acima. 
      reader.readAsDataURL(file)
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    //preview é a div PhotosPreview, que é um container onde ficam as fotos que fizeram upload. 
    //childNodes é cada foto dentro do photosPreview. 
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo') {
        photosDiv.push(item)
      }
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > uploadLimit) {
      alert(`Você atingiu o limite máximo de ${uploadLimit} fotos!`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = PhotosUpload.removePhoto

    div.appendChild(image)

    div.appendChild(PhotosUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'

    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode
    //pegando a lista de photos do photosPreview.
    const photosArray = Array.from(PhotosUpload.preview.children)

    //buscando index da foto clicada. 
    index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()
    
    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if(photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removedFiles"]')

      if(removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }
    return photoDiv.remove()
  }
}

const ImageGallery = {
  highlight: document.querySelector('.gallery .highlight > img'),
  previews: document.querySelectorAll('.galleryPreview img'),
  setImage(e) {
    const { target } = e

    ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    ImageGallery.highlight.src = target.src

  }
}