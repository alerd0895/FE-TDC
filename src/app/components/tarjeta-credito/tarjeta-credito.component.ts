import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  ListTarjetas : any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv : ['' , [Validators.required, Validators.maxLength(4), Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjetas().subscribe(data => {
      console.log(data);
      this.ListTarjetas = data;
    }, error => {
      this.toastr.error('No se pudo obtener las tarjetas', 'Error')
      console.log(error);
    });
  }

  guardarTarjeta(): void{
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }
    if(this.id == undefined){
      //agregar nueva tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta se guardo con exito', 'Tarjeta Guardada')
        this.obtenerTarjetas()
        this.form.reset()
      },error =>{
        this.toastr.error('La tarjeta no pudo ser guardada', 'Error')
        console.log(error)
      });
    }else{
      //Editar tarjeta
      tarjeta.id = this.id
      this._tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion = 'Agregar'
        this.id = undefined
        this.toastr.info("La tarjeta fue actualizo con exito","Tarjeta Actualizada")
        this.obtenerTarjetas();
      },error =>{
        this.toastr.error('La tarjeta no pudo ser actualizada', 'Error')
        console.log(error);
      });
    }
  }
  eliminarTarjeta(id : number) {
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada con exito', 'Tarjeta Eliminada')
      this.obtenerTarjetas()
    },error =>{
      this.toastr.error('La tarjeta no pudo ser eliminada', 'Error')
      console.log(error);
    });
  }
  editarTarjeta(tarjeta: any){
    this.accion = 'Editar';
    this.id = tarjeta.id;
    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }
}
