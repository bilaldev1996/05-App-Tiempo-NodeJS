const inquirer = require("inquirer");
require("colors");

const preguntas = [
    {
        type: "list",
        name: "opcion",
        message: "¿Qué desea hacer?",
        choices: [
            {
                value: 1,
                name: `${'1.'.green}Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green}Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]


//Método que muestra nuestro menú
const inquirerMenu = async()=>{
    console.clear()
    console.log('========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('========================='.green);
    
    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;
}


//Método que nos pregunta si queremos continuar
const pausa = async() => {
    
    console.log()
    const {opt} = await inquirer.prompt([
        {
            type: 'input',
            name: 'opt',
            message: `Presione ${ 'ENTER'.green } para continuar`
        }
    ])
    return opt;
}


//Método para leer datos introducidos por el usuario
const leerInput = async(message) =>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate: ( value )=>{
                if(value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question)
    return desc;
}

const listarLugares = async(lugares = [])=>{

        console.log()
        const choices = lugares.map( (lugar,i) =>{
            const idx = `${i + 1}.`.green
            return {
                value : lugar.id,
                name : `${idx} ${lugar.nombre}`
            }
        })

        choices.unshift( {
            value : '0',
            name: '0.'.green + 'Cancelar'
        })

        const preguntas = [
            {
                type : 'list',
                name : 'id',
                message : 'Seleccione lugar:',
                choices
            }
        ]
        const {id} = await inquirer.prompt(preguntas);
        return id
    }
    const confirmar = async() => {
        
        console.log()
        const {confirmar} = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message : '¿Estás seguro de que quieres borrar la tarea?'
            }
        ])
        //console.log(confirmar)
        return confirmar;
    }

    
    const marcarTareasCompletadas = async(tareas = [])=>{

        console.log()
        const choices = tareas.map( (tarea,i) =>{
            const idx = `${i + 1}.`.green
            return {
                value : tarea.id,
                name : `${idx} ${tarea.desc}`,
                checked: (tarea.completadoEn) ? true : false 
            }
        })

        const pregunta = [
            {
                type : 'checkbox',
                name : 'ids',
                message : 'Seleccione',
                choices
            }
        ]
        const {ids} = await inquirer.prompt(pregunta);
        return ids
    }

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    marcarTareasCompletadas
}