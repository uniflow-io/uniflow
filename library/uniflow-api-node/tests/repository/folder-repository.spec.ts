import { describe, test, beforeAll } from '@jest/globals'
import { default as Container } from "../../src/container";
import { FolderRepository, UserRepository } from '../../src/repository';
import { FakeFolderFactory, FakeUserFactory } from '../../src/factory'
import { FolderEntity, UserEntity } from '../../src/entity';
import { assert } from 'chai';

describe('folder-repository', () => {
    const container = new Container()
    const userRepository = container.get(UserRepository)
    const folderRepository = container.get(FolderRepository)
    const userFactory = container.get(FakeUserFactory)
    const folderFactory = container.get(FakeFolderFactory)
    let user: UserEntity
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

        user = await userFactory.create()
        await userRepository.save(user)
        
        folders.set('A', await folderFactory.create({user}))
        folders.set('B', await folderFactory.create({
            user,
            parent: folders.get('A')
        }))
        folders.set('C', await folderFactory.create({
            user,
            parent: folders.get('B')
        }))
        folders.set('D', await folderFactory.create({
            user,
            parent: folders.get('B')
        }))
        folders.set('E', await folderFactory.create({
            user,
            parent: folders.get('C')
        }))

        for(const folder of folders.values()) {
            await folderRepository.save(folder)
        }
    });

    test.each([
        ['E', ['A', 'B', 'C', 'E']],
        ['D', ['A', 'B', 'D']],
        ['B', ['A', 'B']],
    ])('findOneByUserAndPath success', async (folder: string, paths: string[]) => {
        const targetFolder = folders.get(folder) as FolderEntity
        paths = paths.map(path => { return (folders.get(path) as FolderEntity).slug })
        const matchedFolder = await folderRepository.findOneByUserAndPath(user, paths)
        assert.isDefined(matchedFolder)
        assert.isTrue(matchedFolder && matchedFolder.uid === targetFolder.uid)
    });

    test.each([
        ['A', undefined],
        ['B', 'A'],
        ['C', 'B'],
        ['E', 'C'],
        ['D', 'B'],
    ])('findOneParent success', async (folder: string, parent: string|undefined) => {
        const targetFolder = folders.get(folder) as FolderEntity
        const parentFolder = parent === undefined ? undefined : folders.get(parent) as FolderEntity
        const matchedFolder = await folderRepository.findOneParent(targetFolder)
        if(parentFolder === undefined) {
            assert.isUndefined(matchedFolder)
        } else {
            assert.isDefined(matchedFolder)
            assert.isTrue(matchedFolder && matchedFolder.uid === parentFolder.uid)
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