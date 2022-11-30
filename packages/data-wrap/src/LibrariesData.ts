import { Library} from './Library.js';
import { DrupalSearchData } from './DrupalSearchData.js';

export class LibrariesData extends DrupalSearchData {

    type: string = "library";

    libraries: Library[] = [];

}