import * as fs from 'fs'
import * as path from 'path'

interface PathStat {
  mode: number
  name: string
  type: 'FILE' | 'DIRECTORY'
}

type UtilFunc<T = void> = (targetPath: string, mode?: number) => Promise<T>

const isWritable: UtilFunc<boolean> = (targetPath) => {
  return new Promise<boolean>((res) => {
    fs.lstat(targetPath, err => {
      if ( err ) {
        if ( err.code === 'ENOENT' ) { return res(true) }
      }
      return res(false)
    })
  })
}

const getStats: UtilFunc<PathStat> = (targetPath) => {
  return new Promise<PathStat>((res, rej) => {
    fs.stat(targetPath, (err, stats) => {
      if ( err ) { return rej(err) }

      let type: 'FILE' | 'DIRECTORY' | undefined
      if ( stats.isDirectory() ) {
        type = 'DIRECTORY'
      } else if ( stats.isFile() ) {
        type = 'FILE'
      }

      if ( type === undefined ) { return rej(`${targetPath} is not a file or directory.`)}

      const stat: PathStat  = {
        name: targetPath,
        mode: stats.mode,
        type
      }
      return res(stat)
    })
  })
}

const getPathsInDir: UtilFunc<string[]> = (targetPath) => {
  return new Promise<string[]>((res, rej) => {
    fs.readdir(targetPath, (err, items) => {
      if ( err ) { return rej(err) } 

      return res(items)
    })
  })
}

const makeDir: UtilFunc = (targetPath, mode) => {
  return new Promise((res, rej) => {
    fs.mkdir(targetPath, mode, (err) => {
      if ( err ) { return rej(err) }

      return res()
    })
  })
}

const copyFile = async (file: PathStat, destination: string) => {
  const readStream = fs.createReadStream(file.name)
  const writeStream = fs.createWriteStream(destination, { mode: file.mode })

  writeStream.on('open', () => {
    readStream.pipe(writeStream)
  })

  writeStream.once('finish', () => {
    return
  })
}

const copyDirectory = async (directory: PathStat, destination: string) => {
  const pathsToCopy = await getPathsInDir(directory.name)
  
  pathsToCopy.forEach(async copyPath => {
    const newDestination = path.join(destination, copyPath)
    const newSource = path.join(directory.name, copyPath)
    const copyStat = await getStats(newSource)

    if ( copyStat.type === 'FILE' ) {
      await copyFile(copyStat, newDestination)
    } else if ( copyStat.type === 'DIRECTORY' ) {
      await tsCopy(newSource, newDestination)
    }

  })
}

const handleDirectory = async (directory: PathStat, destination: string) => {
  const targetDirIsWritable = await isWritable(destination)
  if ( targetDirIsWritable ) {
    await makeDir(destination, directory.mode)
  }

  return copyDirectory(directory, destination)
}

const tsCopy = async (source: string, destination: string) => {
  const directory = await getStats(source)
  await handleDirectory(directory, destination)
}

export default tsCopy