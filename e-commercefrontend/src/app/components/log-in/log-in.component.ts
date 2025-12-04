// import { errorContext } from 'rxjs/internal/util/errorContext';
// import { LoginMapper } from './../Marrper/LoginMapper';
// import { Service } from './../service';
// import { Component } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-log-in',
//   imports: [FormsModule],
//   templateUrl: './log-in.component.html',
//   styleUrl: './log-in.component.css'
// })
// export class LogInComponent {

//   email!:string;
//   password!:string;
// constructor(
//   private service:Service,
//   private loginmapper: LoginMapper
// ){}

//   login(){
//     // console.log('here in login');
//     // console.log(this.email);
//     // console.log(this.password);
//     if(this.email==null||this.password==null){
//       return;
//     }
// // make request here 

// const l=this.loginmapper.makeLongin(this.email,this.password);

// console.log("we make login ");
// this.service.login(l).subscribe({
//       next:(res)=>{
//         console.log('Success!', res);
//         localStorage.setItem("token", res); 
//         this.email = '';
//         this.password = '';
//         alert('Login successful!');
//       },
//       error:(err)=>{
//         console.log('Error:', err);
//         // console.log(err);
//         if(err.status === 409){
//           alert('Password or email not correct');
//         } else {
//           alert('Login failed');
//         }
//       }
//     });

//   }

// }

