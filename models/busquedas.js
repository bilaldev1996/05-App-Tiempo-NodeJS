const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = []
    path = './db/database.json';

    constructor() {
        //TODO: leer base de datos si existe
        this.leerDB()
    }

    get historialCapitalizado(){
        //Capitalizar cada palabra
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ')

            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ')
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language' : 'es'
        }
    }

    get paramsWeather(){
        return{
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    //Método para buscar una ciudad
    async ciudad( lugar = '' ){
        try{
            //petición http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await instance.get()
            //console.log(resp.data.features)
            return resp.data.features.map(lugar =>({
                id : lugar.id,
                nombre : lugar.place_name,
                lng : lugar.center[0],
                lat: lugar.center[1]
            }))
            //retornar los lugares que coincidan con el lugar que ha introducido la persona
        }catch(error){
            return [];
        }
    }

    async clima(lat,lon){
        try{

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.paramsWeather
            })

            const resp = await instance.get()
            //console.log(resp.data.main);
            return {
                min : resp.data.main.temp_min,
                max : resp.data.main.temp_max,
                normal : resp.data.main.temp,
                desc : resp.data.weather[0].description
            }
        }catch(e){
            console.log(e);
        }
    }

    aregarHistorial(lugar = ''){

        
        this.leerDB()
        //Prevenir duplicados
        if(!this.historial.includes(lugar.toLocaleLowerCase())){
            this.historial.unshift(lugar.toLocaleLowerCase())
            this.guardarDB()
        }
        //Grabar db
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.path, JSON.stringify(payload))
    }

    leerDB () {
        if( !fs.existsSync(this.path)){
            return null
        }
    
        const info = fs.readFileSync( this.path, {encoding : 'utf-8'} )

        if(!info) return;
    
        const data = JSON.parse(info)
        //console.log(data)
        this.historial = data.historial
    }


}

module.exports = Busquedas;