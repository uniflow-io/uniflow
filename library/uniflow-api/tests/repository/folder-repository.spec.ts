import { describe, test, beforeAll } from '@jest/globals'
import { default as Container } from "../../src/container";
import { FolderRepository } from '../../src/repository';
import { FakeFolderFactory } from '../../src/factory'
import { FolderEntity } from '../../src/entity';
import { assert } from 'chai';

describe('folder-repository', () => {
    const folderRepository = Container.get(FolderRepository)
    const folderFactory = Container.get(FakeFolderFactory)
    const folders = new Map<string, FolderEntity>()

    beforeAll(async () => {
        /*
        Folder tree
        A
        |->B
           |->C
              |->E
           |->D
        */

        folders.set('A', folderFactory.create())
        folders.set('B', folderFactory.create({
            parent: folders.get('A')
        }))
        folders.set('C', folderFactory.create({
            parent: folders.get('B')
        }))
        folders.set('D', folderFactory.create({
            parent: folders.get('B')
        }))
        folders.set('E', folderFactory.create({
            parent: folders.get('C')
        }))

        for(const folder of folders.values()) {
            await folderRepository.save(folder)
        }
    });
 
    test.each([
        ['A', 'B'],
        ['A', 'C'],
        ['A', 'D'],
        ['B', 'D'],
        ['B', 'E'],
    ])('isCircular true', async (a: string, b: string) => {
        const folder = folders.get(a) as FolderEntity
        const parent = folders.get(b) as FolderEntity
        assert.isTrue(await folderRepository.isCircular(folder, parent))
    });
 
    test.each([
        ['B', 'A'],
        ['C', 'A'],
        ['E', 'C'],
        ['E', 'A'],
        ['D', 'A'],
    ])('isCircular true', async (a: string, b: string) => {
        const folder = folders.get(a) as FolderEntity
        const parent = folders.get(b) as FolderEntity
        assert.isFalse(await folderRepository.isCircular(folder, parent))
    });
})