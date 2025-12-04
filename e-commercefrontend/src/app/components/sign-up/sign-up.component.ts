// import { NgComponentOutlet } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { Service } from '../service';
// import { SighupMapper } from '../Marrper/SighupMarpper';

// @Component({
//   selector: 'app-sign-up',
//   imports: [NgComponentOutlet,FormsModule],
//   templateUrl: './sign-up.component.html',
//   styleUrl: './sign-up.component.css'
// })
// export class SignUpComponent {
// firstName!:string;
// lastName!:string
// email!:string
// password!:string
// confirmPassword!:string

// constructor(
//   private service:Service,
//   private sighupmapper:SighupMapper
// ){}

// sighUp(){
//   if(this.password==null||this.email==null||this.firstName==null||this.lastName==null){
//   alert("fill all fields of sighup ");
//   return;
// }
// if (this.password!==this.confirmPassword){
//   alert("the passwords not match");
//   return;
// }

// // here put the request of this
// const s=this.sighupmapper.makeSighup(this.firstName,this.lastName,this.email,this.password);

// this.service.Sighup(s).subscribe({

// next:(res)=>{
// alert("sign up succssefully");
// this.email='';
// this.firstName='';
// this.lastName='';
// this.password='';
// this.confirmPassword='';
// console.log(res);

// },
// error:(res)=>{
//   // console.log('error accure ');
//   // console.log(res);
// alert("this email used before try another one ");
// }









// })




// }










// }
