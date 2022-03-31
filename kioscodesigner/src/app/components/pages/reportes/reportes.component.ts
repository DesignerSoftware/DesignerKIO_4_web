import { Component, OnInit } from '@angular/core';
import { OpcionesKioskosService } from 'src/app/services/opciones-kioskos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import { CadenaskioskosappService } from 'src/app/services/cadenaskioskosapp.service';
import * as moment from 'moment';

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.scss"],
})
export class ReportesComponent implements OnInit {
  formulario: FormGroup;
  fechaDesdeCal: Date = null;
  fechaHastaCal: Date = null;
  enviocorreo: boolean;
  correo: string = null;
  dirigidoa: string = null;
  reporteAusentismos = null;
  temp = null;
  year:string;
  anos: string[]=['2019','2020','2021'];
  nombreRuta: string='';
  fechadesde: string = null;
  fechahasta: string = null;
  anocir: string = null; 
  ano: string = null; 

  constructor(
    public opcionesKioskosServicio: OpcionesKioskosService,
    private router: Router,
    private fb: FormBuilder,
    public usuarioServicio: UsuarioService,
    public reporteServicio: ReportesService,
    private cadenasKioskos: CadenaskioskosappService,
    public datepipe: DatePipe
  ) {
    //console.log("constructor");
    this.crearFormulario();
    this.reporteServicio.reporteSeleccionado = null;
 
  }

  ngOnInit() {
    //console.log(this.usuarioServicio.cadenaConexion);
    //console.log("ngOnInit reportes");
    if (this.usuarioServicio.cadenaConexion) {
      this.cargarDatosIniciales();
    } else {
      this.getInfoUsuario();
    }
  }

  getInfoUsuario(){
    const sesion = this.usuarioServicio.getUserLoggedIn();
    this.usuarioServicio.setUsuario(sesion['usuario']);
    this.usuarioServicio.setEmpresa(sesion['empresa']);
    this.usuarioServicio.setTokenJWT(sesion['JWT']);
    this.usuarioServicio.setGrupo(sesion['grupo']);
    this.usuarioServicio.setUrlKiosco(sesion['urlKiosco']);
    //console.log('usuario: ' + this.usuarioServicio.usuario + ' empresa: ' + this.usuarioServicio.empresa);
    this.cadenasKioskos.getCadenaKioskoXGrupoNit(sesion['grupo'], sesion['empresa'])
    .subscribe(
      data => {
        //console.log('getInfoUsuario', data);
        //console.log(sesion['grupo'])
        for (let i in data) {
          if (data[i][3] === sesion['grupo']) { // GRUPO
          const temp = data[i];
          //console.log('cadena: ', temp[4]) // CADENA
          this.usuarioServicio.cadenaConexion=temp[4];
          //console.log('pages CADENA: ', this.usuarioServicio.cadenaConexion)
          this.cargarDatosIniciales();
          }
        }
      }
    );
  }

  cargarDatosIniciales(){
    this.filtrarOpcionesReportes();
    this.consultarParametrosReportes();
    this.getCorreoConexioneskioskos();
    this.cargarNotificaciones();
  }  

  conviertefecha(fecharecibidatexto) {
    let fec = fecharecibidatexto;

    let anio = fec.substring(0, 4);
    let mes = fec.substring(500, 7);
    let dia = fec.substring(8, 10);

    let ensamble = dia + "-" + mes + "-" + anio;
    let fecha = new Date(ensamble).toLocaleDateString("es-CO");
    return fecha;
  }

  crearFormulario() {
    // console.log("crearFormulario()");
    this.formulario = this.fb.group({
      fechadesde: [, Validators.required],
      fechahasta: [, Validators.required],
      anoCIR: [,],
      enviocorreo: [false],
      dirigidoa: [],
    });
  }

  consultarParametrosReportes() {
    this.usuarioServicio
      .getParametros(this.usuarioServicio.usuario, this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion)
      .subscribe((data) => {
        //console.log("data parametrosReportes", data);
        //console.log("fecha desde: " + data[0][0]);
        //this.fechaDesde =  new Date(Date.UTC(2020,11,12,3,0,0,0));
        this.fechaDesdeCal = data[0][0];
        this.fechaHastaCal = data[0][1];
        this.enviocorreo = data[0][2];
        this.dirigidoa = data[0][3] || '';
        this.formulario.get("fechadesde").setValue(this.fechaDesdeCal);
        this.formulario.get("fechahasta").setValue(this.fechaHastaCal);
        this.formulario
          .get("enviocorreo")
          .setValue(data[0][2] === "S" ? true : false);
        this.formulario.get("dirigidoa").setValue(this.dirigidoa);
      });
  }

  filtrarOpcionesReportes() {
    let opkTempo: any = [];
    if (
      this.reporteServicio.opcionesReportes == null ||
      this.reporteServicio.opcionesReportes.length === 0 ||
      this.reporteServicio.opcionesReportes === []
    ) {
      opkTempo = this.opcionesKioskosServicio
        .getOpcionesKiosco(
          this.usuarioServicio.empresa,
          this.usuarioServicio.usuario,
          this.usuarioServicio.cadenaConexion
        )
        .subscribe((data) => {
          //console.log("opciones Consultadas", data);
          opkTempo = data;
          this.reporteServicio.reportesEmpleado = opkTempo.filter(
          (opcKio) => opcKio["clase"] === "REPORTE" && opcKio['kiorol']['nombre']==="EMPLEADO"
          );
          this.reporteServicio.reportesJefe = opkTempo.filter(//Variable creada para agregar aparte el reporte del jefe 
            (opcKio) => opcKio["clase"] === "REPORTE" && opcKio['kiorol']['nombre']==="JEFE"
          );
          // console.log('filter 1', this.opcionesReportes[0]['SUBOPCION']);
          /*console.log(
            "opciones filtradas reportes ",
            this.reporteServicio.opcionesReportes
          );*/
          
          // console.log('opcionesReportes ' , this.reporteServicio.opcionesReportes);
          // console.log('opcionesReportes descr ' , this.reporteServicio.opcionesReportes[1].descripcion);
          
          this.reporteServicio.reportesEmpleado= this.reporteServicio.reportesEmpleado.sort(function (a, b) {
            if (a.descripcion > b.descripcion) {
              return 1;
            }
            if (a.descripcion < b.descripcion) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          this.reporteServicio.opcionesReportes = this.reporteServicio.reportesEmpleado.concat(this.reporteServicio.reportesJefe);
          // console.log('reportesEmpleado 2 ' , this.reporteServicio.reportesEmpleado);
          this.reporteServicio.numeroReporte = (this.reporteServicio.opcionesReportes.length - 1) - (this.reporteServicio.reportesJefe.length - 1) ;
          
          // console.log(this.reporteServicio.reporteHorasExtra);
          // console.log(this.temp);
          // console.log('numero empieza json' ,this.numero);
          //console.log("completa :",this.temp);
          //console.log("completa :",this.temp.length)
        });
    } else {
      /*opkTempo = this.opcionesKioskosServicio.opcionesKioskos;
      this.opcionesReportes = opkTempo.filter(
        (opcKio) => opcKio['CODIGO'] === '20'
      );
      console.log('filter 2', this.opcionesReportes[0]['SUBOPCION']);*/
    }
  }

  getCorreoConexioneskioskos() {
    this.usuarioServicio
      .consultarCorreoConexioneskioskos(
        this.usuarioServicio.usuario,
        this.usuarioServicio.empresa, this.usuarioServicio.cadenaConexion
      )
      .subscribe((data) => {
        this.correo = data["result"];
        //console.log("correo: " + this.correo);
      });
  }

  seleccionarReporte(index: number) {
    //console.log("seleccionarReporte");
    //console.log("opcionesActuales", this.temp);
    //console.log(this.reporteServicio.opcionesReportes[index]);
    //console.log(index);
    // console.log('index:' ,index);
    // console.log('numero: ' , this.reporteServicio.numeroReporte);
    this.reporteServicio.reporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ];
    // this.router.navigateByUrl(`/reportes/${index}`);
    this.reporteServicio.codigoReporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ]["codigo"];
    this.reporteServicio.nombreReporteSeleccionado = this.reporteServicio.opcionesReportes[
      index
    ]["descripcion"];
    // console.log('this.reporteServicio.codigoReporteSeleccionado ', this.reporteServicio.codigoReporteSeleccionado);
    
    this.vigenciasCIR();
  }

  // consumo de servicio KIOVIGENCIASCIR

  vigenciasCIR(){
    this.opcionesKioskosServicio
      .getKioVigenciaCIR(this.usuarioServicio.empresa, this.reporteServicio.codigoReporteSeleccionado,this.usuarioServicio.cadenaConexion)
      .subscribe((data: Array<string>) => {
        
        this.opcionesKioskosServicio.kiovigCIR = data;
        // console.log('vigcir ',data);
        // console.log('empresa ',this.usuarioServicio.empresa);      
         
      });
  }

  limpiarSeleccionado() {
    //console.log("clear seleccionado");
    this.reporteServicio.reporteSeleccionado = null;
  }

  enviar() {
    // console.log(this.formulario);
    Object.values(this.formulario.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.formulario.valid) {
      this.anocir = this.formulario.get("anoCIR").value
      if (this.reporteServicio.codigoReporteSeleccionado == "22") {
        this.ano = this.opcionesKioskosServicio.kiovigCIR[this.anocir]["ano"];
        //console.log('ano:' , this.opcionesKioskosServicio.kiovigCIR[anocir]);
        this.fechadesde = this.ano+"-01-01";
        this.fechahasta = this.ano+"-12-31";
        //console.log('this.opcionesKioskosServicio.kiovigCIR', this.opcionesKioskosServicio.kiovigCIR);
        //console.log('es CIR: ', fechadesde ,', ' , fechahasta);      
      } else {
        this.fechadesde = this.formulario.get("fechadesde").value;
        this.fechahasta = this.formulario.get("fechahasta").value; 
        //console.log('no es CIR: ', fechadesde ,', ' , fechahasta);      
      }
      
      if (this.fechadesde >= this.fechahasta) {
        const text =
          "<div class='alert alert-danger alert-dismissible fade show' role='alert'>" +
          '<i class="fa fa-exclamation-circle"></i>' +
          "Error: La fecha hasta debe ser mayor a la fecha desde." +
          "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
          "<span aria-hidden='true'>&times;</span>" +
          "</button>" +
          "</div>";
        document.getElementById("divm").innerHTML = text;
        document.getElementById("divm").style.display = "";
        swal.fire(
          "¡Validar fechas!",
          "La fecha hasta debe ser mayor a la fecha desde.",
          "error"
        );
        return false;
      } else {
        document.getElementById("divm").innerHTML = "";
        document.getElementById("divm").style.display = "none";

        if (this.reporteServicio.reporteSeleccionado["codigo"] === "22") {
          // si el reporte seleccionado es certingresos
          // let fechaDesde: Date = new Date(this.conviertefecha(this.formulario.get('fechadesde').value)/* + 'T00:00:00'*/);
          // let fechaHasta: Date = new Date(this.conviertefecha(this.formulario.get('fechahasta').value)/* + 'T00:00:00'*/);
          this.reporteServicio
            .validaFechasCertingresos(
              this.fechadesde,
              this.fechahasta,
              this.usuarioServicio.cadenaConexion
            )
            .subscribe((data) => {
              //console.log(data);
              if (data) {
                //console.log("fechas correctas");
                //this.obtenerSecuenciaEmpleado();
                this.actualizaParametros();
              } else {
                swal.fire(
                  "¡Validar Fechas!",
                  "Para generar el Certificado de Ingresos y Retenciones se requiere que seleccione las fechas de todo un año " +
                    "(1 de enero a 31 de diciembre).",
                  "info"
                );
                return false;
              }
            });
        } else {
          //this.obtenerSecuenciaEmpleado();
          this.actualizaParametros();
        }
      }
    }
  }

  /*obtenerSecuenciaEmpleado() {
    if (this.usuarioServicio.secuenciaEmpleado == null) {
      this.usuarioServicio
        .getSecuenciaEmpl(this.usuarioServicio.usuario)
        .subscribe((info) => {
          this.usuarioServicio.secuenciaEmpleado = info;
          this.actualizaParametros();
        });
    } else {
      this.actualizaParametros();
    }
  }*/

  formatoddmmyyyy(fecha) {
    let anio = fecha.substring(0, 4);
    let mes = fecha.substring(5, 7);
    let dia = fecha.substring(8, 11);
    let ensamble = dia + "-" + mes + "-" + anio;
    return ensamble;
  }

  cambioFechas(codigoReporte:string) {
    //console.log('codigoReporte '+codigoReporte);
    this.fechaDesdeCal = this.formulario.get("fechadesde").value;
    const ultimoDia  =    moment(this.fechaDesdeCal).endOf('month').format('YYYY-MM-DD');
    //  console.log('fecha desde '+this.fechaDesde ); 
    //  console.log('ultimo dia' +ultimoDia);
     this.formulario.get("fechahasta").setValue(ultimoDia);
    this.fechaHastaCal = this.formulario.get("fechahasta").value;
    // console.log(this.formulario.get("fechahasta").value);
  }

  actualizaParametros() {
    //console.log("actualizaParametros(): ");
    let msjConfirmacion = "";
    /*console.log(
      "Codigo reporte seleccionado: " +
        this.reporteServicio.codigoReporteSeleccionado
    );*/
    if (
      this.reporteServicio.codigoReporteSeleccionado == "25" ||
      this.reporteServicio.codigoReporteSeleccionado == "26" ||
      this.reporteServicio.codigoReporteSeleccionado == "27" ||
      this.reporteServicio.codigoReporteSeleccionado == "28" ||
      this.reporteServicio.codigoReporteSeleccionado == "29"
    ) {
      msjConfirmacion =
        "Se dispone a generar el reporte " +
        this.reporteServicio.nombreReporteSeleccionado +
        ". Tenga presente que para los valores de la certificación se tiene en cuenta la fecha de generación del reporte.";
    } else {
      msjConfirmacion =
        "Se dispone a generar el reporte " +
        this.reporteServicio.nombreReporteSeleccionado + " " +
        this.ano +
        " con fechas desde el " +
        //this.formatoddmmyyyy(this.formulario.get("fechadesde").value) +
        this.fechadesde +
        " hasta el " +
        //this.formatoddmmyyyy(this.formulario.get("fechahasta").value);
        this.fechahasta;
    }
       let fechadesde: string = null;
      let fechahasta: string = null;
      let anocir; 
      if (this.reporteServicio.codigoReporteSeleccionado== "22") {
          anocir = this.formulario.get("anoCIR").value
        // console.log('this.opcionesKioskosServicio.kiovigCIR ', this.opcionesKioskosServicio.kiovigCIR);
        
        let ano = this.opcionesKioskosServicio.kiovigCIR[anocir]["ano"];
      
        if (anocir != null) {

          fechadesde = ano+"-01-01";
          fechahasta = ano+"-12-31";
      
        } else {
          fechadesde = this.formulario.get("fechadesde").value;
          fechahasta = this.formulario.get("fechahasta").value;     
        }
      }else{
        fechadesde = this.formulario.get("fechadesde").value;
        fechahasta = this.formulario.get("fechahasta").value;
      }
    swal
      .fire({
        title: "Confirmación",
        text: msjConfirmacion,
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.usuarioServicio
            .actualizaParametrosReportes(
              this.usuarioServicio.usuario,
              this.usuarioServicio.empresa,
              fechadesde,
              fechahasta,
              this.formulario.get("enviocorreo").value,
              this.formulario.get("dirigidoa").value,
              this.usuarioServicio.cadenaConexion
            )
            .subscribe(
              (data) => {
                //console.log(data);
                if (data === 1) {
                  //console.log("parametros actualizados");
                  this.descargarReporte();
                }
              },
              (error) => {
                swal.fire(
                  "¡Se ha presentado un error!",
                  "Se presentó un error al actualizar las fechas del reporte, por favor inténtelo de nuevo más tarde.",
                  "error"
                );
              }
            );
        }
      });

  }



/////////////////////////////////////////////////////////////////generar reporte 
  descargarReporte() {
    // let anocir: string = null; 
    // anocir = this.formulario.get("anoCIR").value

    let anocir; 
    let anoArchivo;
    // console.log('anoArchivo', anoArchivo);
    
    if(this.reporteServicio.codigoReporteSeleccionado =='22'){

      anocir = this.formulario.get("anoCIR").value
      anoArchivo = this.opcionesKioskosServicio.kiovigCIR[anocir]["anoArchivo"];
      
        this.nombreRuta=this.reporteServicio.reporteSeleccionado["nombreruta"]+anoArchivo;
    }else{
      this.fechaDesdeCal = this.formulario.get("fechadesde").value;
      this.fechaHastaCal = this.formulario.get("fechahasta").value;

      this.nombreRuta=this.reporteServicio.reporteSeleccionado["nombreruta"];
    }

    /*console.log(
      "this.usuarioServicio.secuenciaEmpleado: " +
        this.usuarioServicio.secuenciaEmpleado
    );*/
    swal.fire({
      title: "Generando reporte, por favor espere...",
      onBeforeOpen: () => {
        swal.showLoading();
        //console.log("descargarReporte");
        this.reporteServicio
          .generarReporte(
            // this.reporteServicio.reporteSeleccionado["nombreruta"],
            this.nombreRuta,
            //this.usuarioServicio.secuenciaEmpleado,
            this.formulario.get("enviocorreo").value,
            this.usuarioServicio.correo,
            //this.correo,
            this.reporteServicio.reporteSeleccionado["descripcion"],
            this.reporteServicio.codigoReporteSeleccionado,
            this.usuarioServicio.empresa,
            this.usuarioServicio.cadenaConexion,
            this.usuarioServicio.usuario,
            this.usuarioServicio.grupoEmpresarial,
            this.usuarioServicio.urlKioscoDomain
          )
          .subscribe(
            (res) => {
              //console.log(res);
              swal.fire({
                icon: "success",
                title:
                  "Reporte generado exitosamente, se descargará en un momento",
                showConfirmButton: false,
                timer: 1500,
              });
              const newBlob = new Blob([res], { type: "application/pdf" });
              let fileUrl = window.URL.createObjectURL(newBlob); // add 290920

              //if (window.navigator && window.navigator.msSaveOrOpenBlob) { 290920
              //window.navigator.msSaveOrOpenBlob(newBlob);
              let nav = (window.navigator as any);
              if (nav.msSaveOrOpenBlob) {
                // add 290920
                nav.msSaveOrOpenBlob(
                  newBlob,
                  fileUrl.split(":")[1] + ".pdf"
                );
              } else {
                window.open(fileUrl);
              }
              //return;
              ///}
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              const link = document.createElement("a");
              link.href = data;
              let f = new Date();
              link.download =
                this.reporteServicio.reporteSeleccionado["nombreruta"] +
                "_" +
                this.usuarioServicio.usuario +
                "_" +
                f.getTime() +
                ".pdf";
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                })
              );

              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
            },
            (error) => {
              console.log(error);
              swal.fire(
                "Se ha presentado un error",
                "Se presentó un error al generar el reporte, por favor intentelo de nuevo más tarde!",
                "info"
              );
            }
          );
      },
      allowOutsideClick: () => !swal.isLoading(),
    });
  }


  imagenReporte(opcion: any){
    //console.log('opcion: ', opcion);
    if (opcion.toLowerCase().indexOf("vaca")> -1) {
      return "assets/images/kioVacapendiente.png";
    } else if (opcion.toLowerCase().indexOf("certingresos")> -1) {
      return "assets/images/kio_certingresos.png";
    } else if (opcion.toLowerCase().indexOf("cesantias")> -1) {
      return "assets/images/kioSaldoCesantias.png";
    } else if (opcion.toLowerCase().indexOf("desprendible")> -1) {
      return "assets/images/kio_DesprendibleCO.png";
    } else {
      return "assets/images/reporte.png";
    }
 }

 cargarNotificaciones() {
  this.usuarioServicio.loadAllNotifications();
 }
}
