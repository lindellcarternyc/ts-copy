// Node builtins
import * as path from 'path'

// Test utils
import { read } from 'read-dir-files'

// Modules to test
import tsCopyDir from '../src/ts-copy-dir'

const BASE_PATH = path.resolve(process.cwd(), '__tests__')
const SOURCE_PATH = path.resolve(BASE_PATH, 'test-source')
const DEST_PATH = path.resolve(BASE_PATH, 'test-dest')

describe('ts-copy-dir', () => {
  it('copies a directory and its contents', async () => {
    await tsCopyDir(SOURCE_PATH, DEST_PATH)
    read(SOURCE_PATH, 'utf8', (srcErr, sourceFiles) => {
      if ( srcErr ) { throw srcErr }

      read(DEST_PATH, 'utf8', (destErr, destFiles) => {
        if ( destErr ) { throw destErr }
        expect(sourceFiles).toEqual(destFiles)
      })
    })
  })
})