import { DynamicModule, Logger, Module } from '@nestjs/common';
import { readdirSync } from 'fs';
import path from 'path';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RoomModule, GameModule.registerController(GameModule, path.join(__dirname, 'controller'))],
  controllers: [],
})
export class GameModule {
  static registerController(module: any, root_path: string): DynamicModule {
    const controllersPath = root_path;
    const controllerFiles = readdirSync(controllersPath).filter((file) => file.endsWith(`controller.js`) || file.endsWith(`controller.ts`));
    const controllers: any[] = controllerFiles.map((file) => {
      const controllerModule = require(path.join(controllersPath, file));
      const controllerClass = Object.values(controllerModule).find((item) => typeof item === 'function');
      return controllerClass;
    });

    for (const ct of controllers) {
      Logger.log(`Added ${module.name} Controller = ${ct.name}`);
    }

    return {
      module: module,
      controllers,
    };
  }
}
