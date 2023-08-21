import type { UserId } from '$/commonTypesWithClient/branded';
import { cellsRepository } from '$/repository/cellsRepository';
import { deepCopy } from '$/service/deepCopy';
import { sliceWithTime } from '$/service/sliceWithTime';

export const cellUseCase = {
  delete: async (userId: UserId) => {
    await cellsRepository.deleteWithPlayer(userId);
  },
  restore: async () => {
    const res = await cellsRepository.findOlder();
    if (res === null) return;
    const moreOldCells = sliceWithTime(new Date().getTime() - 1000000, res);
    moreOldCells.forEach((cell) => cellsRepository.delete(cell.x, cell.y, cell.whoOpened));
  },
  updateUserInputs: async (userInputs: (0 | 1 | 2)[][]) => {
    const res = await cellsRepository.findAllUserInputted();
    const newUserInputs = deepCopy<(0 | 1 | 2)[][]>(userInputs);
    res?.forEach((cell) => {
      newUserInputs[cell.y][cell.x] = 1;
      console.log(cell.x, cell.y);
    });
    return newUserInputs;
  },
};
