/** One-line description of any page id, for "keep going" cards and llms.txt. */
import { pageById } from './pages';
export function cardOf(id: string): string { return pageById(id)?.card ?? ''; }
