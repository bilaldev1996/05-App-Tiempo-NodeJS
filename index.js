require('dotenv').config()

const {leerInput,inquirerMenu,pausa,listarLugares} = require('./helpers/inquirer')
const Busquedas = require('./models/busquedas')



const main = async()=>{

    let opt;
    const busquedas = new Busquedas()
    const historial = []

    do{
        opt = await inquirerMenu()

        switch(opt){
            case 1:
                //Mostrar mensaje para que la persona escriba
                const termino = await leerInput('Ciudad: ');

                //Buscar y mostrar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                //El usuario selecciona el lugares
                const id = await listarLugares(lugares)
                if( id === '0') continue;

                const {nombre,lat,lng} = lugares.find( l => l.id === id );

                busquedas.aregarHistorial(nombre)


                //Datos del clima
                const climas = await busquedas.clima(lat,lng)
                const {min,max,normal,desc} = climas;

                //Mostrar resultados
                console.clear()
                console.log('\nInformacion de la ciudad\n'.green)
                console.log('Ciudad : ',nombre);
                console.log('Lat :',lat);
                console.log('Lng :',lng);
                console.log('Temperatura: ',min);
                console.log('Mínima: ',max);
                console.log('Máxima: ',normal);
                console.log('Cómo está el clima: ',desc);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar,i) =>{
                    const idx = `${i + 1}.`.green
                    console.log(idx,lugar);
                })
            break;

            case 0:
            break;
        }
        if(opt !==0) await pausa()
    }while(opt !==0)

}

main()