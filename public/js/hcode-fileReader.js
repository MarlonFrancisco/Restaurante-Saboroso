class HcodeFileReader {
	constructor(inputEl, imgEl) {
		this.inputEl = inputEl;
		this.imgEl = imgEl

		this.initEvent();
	}

	initEvent() {
		document.querySelector(this.inputEl).addEventListener('change', event => {

			this.reader(event.target.files[0]).then(resolve => {
				console.log(resolve);
				document.querySelector(this.imgEl).src = `${resolve}`;
			}).catch(err => {
				console.log(err);
			})

		})
	}

	reader(file) {
		return new Promise((resolve, reject) => {

			let reader = new FileReader();

			reader.onload = () => {
				resolve(reader.result);
			}

			reader.onerror = () => {
				reject("Não foi possivel ler o arquivo");
			}

			reader.readAsDataURL(file);

		})
	}
}