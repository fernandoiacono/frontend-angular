import { EducacionModel } from "./Educacion";
import { ExperienciaLaboralModel } from "./ExperienciaLaboral";
import { HabilidadModel } from "./Habilidad";
import { ProyectoModel } from "./Proyecto";

export class PersonaModel {
    id?: number;
    nombre: string = '';
    apellido: string = '';
    domicilio: string = '';
    fecha_nac: string = '';
    telefono: string = '';
    correo: string = '';
    descripcion: string = '';
    sobre_mi: string = '';
    file_type: string = '';
    facebook_link: string = '';
    github_link: string = '';
    educacion: EducacionModel[] = [];
    experiencia_laboral: ExperienciaLaboralModel[] = [];
    habilidades: HabilidadModel[] = [];
    proyectos: ProyectoModel[] = [];
}