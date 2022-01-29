<template>
	<div>
		<div class="modal fade" id="modalItem" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="modalLabel">{{(campos.type == "salvar") ? "Salvar" : "Editar"}}</h5>
						<button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="itemForm" name="itemForm" @submit.prevent="submit" enctype="multipart/form-data">
							<div class="image-selector" @click="openFileDialog">
								<img :src="foto" id="modal-item-avatar" alt="">
								<h5>Escolha</h5>
								<input type="file" id="avatar_file" name="avatar_file" @change="fileChange">
							</div>
							<p class="error text-danger p-0 m-0" v-if="errors_fields.avatar_file.invalid">{{errors_fields.avatar_file.message}}</p>
							<div class="item-form">
								<input class="form-control mb-1" type="text" id="txtNome" name="txtNome" placeholder="Nome" v-model="nome">
								<p class="error text-danger p-0 m-0" v-if="errors_fields.nome.invalid">{{errors_fields.nome.message}}</p>
								<input class="form-control mb-1" type="email" id="txtEmail" name="txtEmail" placeholder="Email" v-model="email">
								<p class="error text-danger p-0 m-0" v-if="errors_fields.email.invalid">{{errors_fields.email.message}}</p>
								<input class="form-control" type="text" id="txtTelefone" name="txtTelefone" placeholder="Telefone" v-model="telefone">
								<p class="error text-danger p-0 m-0" v-if="errors_fields.telefone.invalid">{{errors_fields.telefone.message}}</p>
								<br>
								<button type="submit" class="btn btn-primary">
									<i class="fa fa-save"></i>
									Salvar
								</button>
								<button type="button" class="btn btn-danger float-end" data-bs-dismiss="modal">
									<i class="fa fa-trash"></i>
									Cancelar
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>	
	</div>
</template>

<script>
const bootstrap = require("bootstrap");
export default {
	props:{
		show: {type: Boolean, required: true},
		campos: {type: Object, required: true}
	},
	data(){
		return{
			nome:"",
			email:"",
			telefone:"",
			foto: "",
			avatar:[],
			modalEl: null,
			submission: false,
			errors_fields: {
				nome: {invalid: false, message: ""},
				email: {invalid: false, message: ""},
				telefone: {invalid: false, message: ""},
				avatar_file: {invalid: false, message: ""}
			}
		};
	},
	watch:{
		show(val){
			if(val){
				const {nome,email,telefone,foto} = this.campos;
				this.nome = nome;
				this.email = email;
				this.telefone = telefone;
				this.foto = foto;
				this.modalEl.show();
			}else{
				this.modalEl.hide();
			}
		}
	},
	mounted(){
		const modal = document.getElementById("modalItem");
		this.modalEl = new bootstrap.Modal(modal);
		modal.addEventListener("hidden.bs.modal", ()=>{
			this.nome = "";
			this.email = "";
			this.telefone = "";
			this.foto =  "";
			this.avatar = [];
			this.submission =  false;
			this.errors_fields = {
				nome: {invalid: false, message: ""},
				email: {invalid: false, message: ""},
				telefone: {invalid: false, message: ""},
				avatar_file: {invalid: false, message: ""}
			};
			this.closeModal();
		});
	},
	methods:{
		closeModal(){
			this.$emit("closeModal");
		},
		openFileDialog(){
			let input_file = document.getElementById("avatar_file");
			input_file.click();
		},
		fileChange(){
			let imgtag = document.getElementById("modal-item-avatar");
			if (event.target.files.length == 0) {
				imgtag.src = this.campos.foto;
				this.foto = this.campos.foto;
				this.avatar = [];
				return;
			}
			this.avatar = event.target.files[0];
			this.foto = this.avatar.name;
			let reader = new FileReader();
			imgtag.title = this.avatar.name;
			reader.onload = function(event) {
				imgtag.src = event.target.result;
			};
			reader.readAsDataURL(this.avatar);
		},
		submit(){
			let valid = this.validateForm();
			if (valid) {
				var formData = new FormData();
				formData.append("nome", this.nome);
				formData.append("email", this.email);
				formData.append("telefone", this.telefone);
				formData.append("foto", this.foto);
				formData.append("avatar_file", this.avatar);

				if (this.campos.type == "salvar") {
					this.saveItem(formData);
				}else{
					this.editItem(this.campos.id,formData);
				}	
			}
		},
		validateForm(){
			let valid = true;
			this.errors_fields = {
				nome: {invalid: false, message: ""},
				email: {invalid: false, message: ""},
				telefone: {invalid: false, message: ""},
				avatar_file: {invalid: false, message: ""}
			};
			if (this.nome == "") {
				this.errors_fields.nome = {invalid: true, message: "Campo Obrigatório*"};
				valid = false;
			}
			if (this.email == "") {
				this.errors_fields.email = {invalid: true, message: "Campo Obrigatório*"};
				valid = false;
			}
			if (this.telefone == "") {
				this.errors_fields.telefone = {invalid: true, message: "Campo Obrigatório*"};
				valid = false;
			}
			if (this.campos.type == "salvar" && this.avatar.length == 0) {
				this.errors_fields.avatar_file = {invalid: true, message: "Campo Obrigatório*"};
				valid = false;
			}
			return valid;
		},
		saveItem(item){
			//const item = {id: this.campos.id, nome: this.nome, email: this.email, telefone: this.telefone, foto: this.foto};
			this.$emit("saveItem", item);
		},
		editItem(id,item){
			//const item = {nome: this.nome, email: this.email, telefone: this.telefone, foto: this.foto};
			this.$emit("editItem", id,item);
		}
	}
};
</script>

<style lang="scss" scoped>
	.image-selector{
		text-align: center;
		padding-top: 20px;
		padding-bottom: 5px;

		&:hover{
			background-color: #ccc;
			cursor: pointer;
		}

		img{
			width: 250px;
			padding-top: 5px;
		}

		h5{
			margin-bottom: 10px;
		}

		#avatar_file{
			display: none;
		}
	}
</style>