import { IQueryConfig, IQueryParams, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate } from "../interfaces/query.interface"

export class QueryBuilder<

T,
TWhereInput = Record<string, unknown>,
TInclude = Record<string, unknown>

>{

    private query : PrismaFindManyArgs;           //what is query here means? what would be actually do in future?
    private countQuery : PrismaCountArgs;
    private page : number = 1;
    private limit : number = 10;
    private skip : number = 0;
    private sortBy : string = "createdAt";
    private sortOrder : "asc" | "desc" = "desc";
    private selectFields : Record<string, boolean | undefined>;


    constructor(                                
        private model : PrismaModelDelegate,    //does private model means it also only can use and call inside class?
        private queryParams : IQueryParams,     // why does constructor arguments would be private?
        private config : IQueryConfig,
    ){

        this.query = {
            where : {},
            include : {},
            orderBy : {},
            skip : 0,
            take : 10
        };

        this.countQuery = {

            where : {},
        }

    }

 }