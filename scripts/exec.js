import { exec as execWithCallback } from 'child_process'

function exec(cmd) {
    return new Promise((resolve, reject) => {
        execWithCallback(cmd, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

export default exec