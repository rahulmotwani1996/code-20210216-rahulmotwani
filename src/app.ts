import fs from 'fs'
import request from 'request'
import EventEmitter from 'events'
import path from 'path'
import parse from 'csv-parse/lib/sync'

var eventEmitter = new EventEmitter()
const FILE_PATH = path.join(__dirname, 'data.csv')

const DATA_FETCHED : string = 'data-fetched'
const URL : string = 'https://raw.githubusercontent.com/vamstar/challenge/master/Dataset3.csv'
request(URL, (err,response) => {
    if(err) {
        console.log("Failed to read csv data from given url")
    }
    fs.writeFile(FILE_PATH, response?.body, (err) => {
        if(!err) {
            eventEmitter.emit(DATA_FETCHED)
        }else {
            console.log("Error occured while saving csv data!")
        }
    })
})


eventEmitter.on(DATA_FETCHED, () => {
    fs.readFile(path.resolve(FILE_PATH), (err, data) => {
        if(err) {
            console.log("Error while reading file", err.message)
        }else {
            const dataString: string = data.toString()
            
            const records: string[][] = parse(dataString,
                {
                    columns: false,
                    skipEmptyLines: true,
                    delimiter: ";"
                })
            
            if(records) {
                const obj: string[] = records[0] as string[]
                console.log("Fields present in csv file\n")
                obj.forEach((value, index) => {
                    console.log(`Field ${index+1} : ${value}\n`)
                })
                console.log(`Total CSV File Size (in Bytes): ${data.length}`)
                console.log(`Total number of rows in file :  ${records.length}`)
            }
        }    
    })    
})





