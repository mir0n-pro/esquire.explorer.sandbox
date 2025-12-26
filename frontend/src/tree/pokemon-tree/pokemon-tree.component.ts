/*
*  Esquire frameworks (tm)
*  Esquire Explorer sandbox
*  Copyright(c) 2001, 2025 mir0n&co www.mir0n.me
*  mailto:mir0n.the.programmer@gmail.com
*
*  History:
* 12/24/2025 mir0n kind parameter is requried for esq-cmd, esq-enode
* 12/24/2025 mir0n use esquire.ui library
*/
import {Component
  , OnInit
  , AfterViewInit
  , inject
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog} from '@angular/material/dialog';
import {EsqNodeType
  , EsqNodeTypeFactory
  , EsqRestApi
  , EsqDictionaryApi
  , EsqExplorerCallApi
  , EsqNodeStatus
  , EsqNodeStatusFactory
} from '@mir0n-pro/esquire.ui/api';
import {EsqDictionary, EsqExplorerCallApiMill} from '@mir0n-pro/esquire.ui/components';
import {EsqExplorerComponent} from '@mir0n-pro/esquire.ui/explorer/flatTree';


import {EsquireService} from '../../rest/api/esquire.service';

@Component({
  selector: 'app-pokemon-tree',
  standalone: true,
  imports: [
    MatToolbarModule,
    EsqExplorerComponent
  ],
  templateUrl: './pokemon-tree.component.html',
  styleUrls: ['./pokemon-tree.component.scss']
})

export class PokemonTreeComponent implements OnInit, AfterViewInit {
  dataService: EsquireService;
  readonly detailsDialog:MatDialog = inject(MatDialog);
  private callApiMill:EsqExplorerCallApiMill;
  private dictionary:EsqDictionaryApi;
   
  constructor(dataService: EsquireService) {
    this.dataService = dataService; 
    EsqNodeTypeFactory.init(Object.values(PokemonNodeTypes));
    EsqNodeStatusFactory.init(Object.values(PokemonStatuses));
    this.dictionary = new EsqDictionary(this.esqRestApiWrapper());
    this.callApiMill = new EsqExplorerCallApiMill(this.detailsDialog, this.dictionary, this.esqRestApiWrapper());
  }

  public esqRestApiWrapper(): EsqRestApi {
    return {
      esquire: (id?: string, skip?: number, take?: number, options?:any) => {
        return this.dataService.esquire(id?encodeURIComponent(id):undefined, skip, take, 'body', false, options) ;
      },
      esquirePath: (id: string, options?:any) => {
        return this.dataService.esquirePath(encodeURIComponent(id), options) ;
      },
      esquireCmd: ( kind: number, id: string, cmd?: string, options?:any) => {
        return this.dataService.esquireCmd( kind, encodeURIComponent(id), cmd, options) ;
      },
     esquireEntityNode: (kind: number, id?: string, name?: string, options?:any) => {
        return this.dataService.esquireEntityNode( kind, (id && id.length >0)? encodeURIComponent(id) : undefined,
          name?encodeURIComponent(name):undefined, 
          options
        );
      },
     esquireDictionary: (kind: number, options?:any) => {
        return this.dataService.esquireDictionary(kind , options);
      },
    }
  };

  public esqExplorerCallApiWrapper(): EsqExplorerCallApi {
    return this.callApiMill.instance();
  }

  async ngOnInit() {
  }

  async ngAfterViewInit() {
  }

}

export const PokemonNodeTypes = {
    Pokemons:    new EsqNodeType( 2, "Pokemons", "img/folders/folder-pocs.ico",   false, [{columnDef:"name", header:"Pokémon"},         {columnDef:"desc", header:"Description"}]),
    Games:       new EsqNodeType( 4, "Games",    "img/folders/folder-games.ico",  false, [{columnDef:"name", header:"Game"},            {columnDef:"desc", header:"Description"}]),
    TvShows:     new EsqNodeType( 6, "TvShows",  "img/folders/folder-shows.ico",  false, [{columnDef:"name", header:"TV Show"},         {columnDef:"desc", header:"Description"}]),
    Books:       new EsqNodeType( 8, "Books",    "img/folders/folder-books.ico",  false, [{columnDef:"name", header:"Book"},            {columnDef:"desc", header:"Description"}]),
    Posters:     new EsqNodeType(10, "Posters",  "img/folders/folder-posters.ico",false, [{columnDef:"name", header:"Poster"},          {columnDef:"desc", header:"Description"}]),
    Pokemon:     new EsqNodeType(12, "Pokemon",  "img/pokemon.ico",               true,  [{columnDef:"name", header:"Pokémon details"}, {columnDef:"desc", header:"Description"}]),
    PokemonLink: new EsqNodeType(13, "Pokemon",  "img/links/pokemon-link.ico",    true,  ),
    Game:        new EsqNodeType(14, "Game",     "img/game.ico",                  true, [{columnDef:"name", header:"Pokémon"},         {columnDef:"desc", header:"Description"}]), 
    GameLink:    new EsqNodeType(15, "Game",     "img/links/game-link.ico",       true, ), 
    TvShow:      new EsqNodeType(16, "TvShow",   "img/tv-show.ico",               true, [{columnDef:"name", header:"Pokémon"},         {columnDef:"desc", header:"Description"}]), 
    TvShowLonk:  new EsqNodeType(17, "TvShow",   "img/links/tv-show-link.ico",    true, ),
    Book:        new EsqNodeType(18, "Book",     "img/book.ico",                  true, [{columnDef:"name", header:"Pokémon"},         {columnDef:"desc", header:"Description"}]), 
    BookLink:    new EsqNodeType(19, "Book",     "img/links/book-link.ico",       true, ),
    Poster:      new EsqNodeType(20, "Poster",   "img/poster.ico",                true, [{columnDef:"name", header:"Pokémon"},         {columnDef:"desc", header:"Description"}]), 
    PosterLink:  new EsqNodeType(21, "Poster",   "img/links/poster-link.ico",     true, ),
    Power :      new EsqNodeType(22, "Power",     "img/power.ico",                false, ), 
} as const;

export const PokemonStatuses = {
    Empty:   new EsqNodeStatus(0,  "Empty",           "img/status/empty.ico"),
    Deleted: new EsqNodeStatus(1,  "Deleted",         "img/status/delete.ico"),
    Locked:  new EsqNodeStatus(2,  "Locked",          "img/status/warning.ico"),
    Good:    new EsqNodeStatus(3,  "Checked",         "img/status/ok.ico"),
    Question:new EsqNodeStatus(4,  "Question",        "img/status/question.ico"),
} as const;
