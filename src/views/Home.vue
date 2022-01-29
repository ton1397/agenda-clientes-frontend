<template>
	<div class="home">
		<div class="container">
			<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
				<div class="col" v-for="cliente in clientes" :key="cliente.id" :data-cliente="cliente.id">
					<div class="card card-container">
						<div class="card-image">
							<img :src="cliente.foto" alt="">
						</div>
						<div class="card-body">
							<h5 class="card-title">{{cliente.nome}}</h5>
							<p>{{cliente.email}}</p>
							<p>{{cliente.telefone}}</p>
							<br>
							<button class="btn btn-primary" @click="modalShow('editar',cliente.id)">
								<i class="fa fa-pen"></i>
							</button>
							<button class="btn btn-danger float-end" @click="deleteItem(cliente.id)">
								<i class="fa fa-trash"></i>
							</button>
						</div>
					</div>
				</div>
				<div class="col">
					<div class="card card-container add" @click="modalShow('salvar')">
						<div class="card-body text-center">
							<i class="fa fa-plus"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
		<modalItem :campos="modal" :show="showModal" @saveItem="saveItem" @editItem="editItem" @closeModal="closeModal"/>
	</div>
</template>

<script>
import axios from "axios";
import modalItem from "@/components/modalItem.vue";
export default {
	name: "Home",
	components:{
		modalItem
	},
	data(){
		return{
			newItem: false,
			clientes:[],
			showModal: false,
			modal:{
				type: "",
				nome: "",
				email: "",
				telefone: "",
				foto: ""
			},

		};
	},
	created(){
		this.getClientes();
	},
	methods:{
		getClientes(){
			axios({
				url: this.$api+"/clients",
				method: "GET"
			}).then(response=>{
				this.clientes = response.data.result;
			}).catch(erro=>{
				console.log(erro);
			});
		},
		modalShow(type, clienteID=null){
			this.modal.type = type;
			if(type=="salvar"){
				const id = this.clientes[this.clientes.length-1].id+1;
				this.modal.id = id;
				this.modal.foto = "http://localhost:3000/static/image_default.png";
			}else{
				const item = this.clientes.filter(item=>item.id==clienteID)[0];
				this.modal.id = item.id;
				this.modal.foto = item.foto;
				this.modal.nome = item.nome;
				this.modal.email = item.email;
				this.modal.telefone = item.telefone;
			}
			this.showModal = true;
		},
		closeModal(){
			this.modal.type = "";
			this.modal.id = "";
			this.modal.foto = "";
			this.modal.nome = "";
			this.modal.email = "";
			this.modal.telefone = "";
			this.showModal = false;
		},
		saveItem(item){
			axios({
				url: this.$api+"/clients",
				method: "POST",
				"async": true,
				"crossDomain": true,
				"processData": false,
				"contentType": false,
				"mimeType": "multipart/form-data",
				data: item
			}).then(response=>{
				console.log(response);
				this.showModal = false;
				this.getClientes();
			}).catch(error=>{
				console.log(error);
			});
		},
		editItem(id,item){
			axios({
				url: this.$api+"/clients/"+id,
				method: "PUT",
				"async": true,
				"crossDomain": true,
				"processData": false,
				"contentType": false,
				"mimeType": "multipart/form-data",
				data: item
			}).then(response=>{
				console.log(response);
				this.showModal = false;
				this.getClientes();
			}).catch(error=>{
				console.log(error);
			});
		},
		deleteItem(id){
			axios({
				url: this.$api+"/"+id,
				method: "DELETE",
			}).then(response=>{
				console.log(response);
				this.getClientes();
			}).catch(error=>{
				console.log(error);
			});
		},
	}
};
</script>

<style lang="scss" scoped>

.card-container{
	width: 18rem;

	.card-image{
		padding: 10px;
		text-align: center;

		img{
			width: 210px;
			height: 200px;
			border-radius: 50%;
		}
	}

	&.add{
		height: 428px;

		i{
			padding-top: 170px;
			font-size: 3.5em;
		}

		&:hover{
			cursor: pointer;
			background-color: #e2e2e2;
		}
	}
}

@media screen and (max-width: 767px) {
	.card-container{
		margin: auto;
	}
}

</style>
