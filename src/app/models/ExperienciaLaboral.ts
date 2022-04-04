import { TipoEmpleoModel } from "./TipoEmpleo"

export class ExperienciaLaboralModel {
    id?: number;
    nombre_empresa: string = '';
    es_trabajo_actual: boolean = false;
    fecha_inicio: string = '';
    fecha_fin: string = '';
    descripcion: string = '';
    orden: number = 0;
    tipo_empleo : TipoEmpleoModel = new TipoEmpleoModel();
}