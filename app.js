"use strict"

Vue.use(window.vuelidate.default);
const {required, minLength, maxLength} = window.validators;

const app = new Vue({
	el: "#app",
	data : {
		id: "",
		password: "",
		errorMessage: "",
		postErrorMessage: "",
		emailErrorMessage: "",
		genderErrorMessage: "",
		name: "",
		birthday: "",
		man: 0,
		woman: 0,
		gender: "",
		email: "",
		post: "",
		address: "",
		job: "",
		category: [],
		unique_id: 1,
		lists: []
	},
	validations: {
		id: {
			required,
			minLength: minLength(6),
			maxLength: maxLength(10)
		},
		password: {
			required,
			minLength: minLength(6),
			maxLength: maxLength(10)
		}
	},
	watch : {
		post: function(){
			this.fetchAddress();
		}
	},
	methods : {
		validate(status){
			const secret = {id: "machiren", password: "machiren"}
			if(secret.id === this.id && secret.password === this.password && status === false){
				let dom = document.getElementById("login");
				dom.href = 'list.html'
				dom.click();
			}else{
				this.errorMessage = 'ID、またはパスワードが違います。';
				return console.log("validete");
			}
		},
		add(){
			const emailValid = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			const postValid = /^\d{3}-?\d{4}$/;
			if(this.man === '1'){
				this.gender = "男性";
				this.genderErrorMessage = "";
			}else if(this.woman === '2'){
				this.gender = "女性";
				this.genderErrorMessage = "";
			}else{
				this.genderErrorMessage = "性別を入力してください"
			}
			if(!emailValid.test(this.email) && !postValid.test(this.post)){
				this.emailErrorMessage = "有効なメールアドレスを設定してください";
				this.postErrorMessage = "有効な郵便番号を設定してください";
				return;
			}else if(!emailValid.test(this.email)){
				this.emailErrorMessage = "有効なメールアドレスを設定してください";
				this.postErrorMessage = "";
				return;
			}else if(!postValid.test(this.post)){
				this.postErrorMessage = "有効な郵便番号を設定してください";
				this.emailErrorMessage = "";
				return;
			}else if(this.name !== "" && this.birthday !== "" && this.address !== "" && this.job !== "" && this.category !== ""){
				let list = {
					id: this.unique_id,
					name: this.name,
					birthday: this.birthday,
					gender: this.gender,
					email: this.email,
					post: this.post,
					address: this.address,
					job: this.job,
					category: this.category
				}
				this.lists.push(list);
				this.unique_id++;
				this.reset();
			}
		},
		deleteList(index){
			if(confirm('本当に削除しますか?')){
        this.lists.splice(index,1);
      }
		},
		reset(){
			this.name = "";
			this.birthday = "";
			this.man = "";
			this.woman = "";
			this.gender = "";
			this.email = "";
			this.post = "";
			this.address = "";
			this.job = "";
			this.emailErrorMessage = "";
			this.postErrorMessage = "";
			this.genderErrorMessage = "";
			document.getElementById('category').selectedIndex = -1;
		},
		change(val){
			val === 1 ? this.woman = 0 : this.man = 0;
		},
		fetchAddress(){
			const url = 'http://zipcloud.ibsnet.co.jp/api/search?zipcode=' + this.post;
			axios.get(url).then((res) => {
				res.data.status === 400 ? "" : this.address = res.data.results[0].address1 + res.data.results[0].address2 + res.data.results[0].address3;
			})
		}
  }
});