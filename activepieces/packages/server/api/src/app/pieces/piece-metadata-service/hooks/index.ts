import { PieceCategory, PieceOrderBy, PieceSortBy, PlatformId, SuggestionType } from '@activepieces/shared'
import { PieceMetadataSchema } from '../../piece-metadata-entity'
import { filterPiecesBasedOnEmbedding, filterPiecesBasedUser } from './piece-filtering'
import { sortAndOrderPieces } from './piece-sorting'

export const defaultPieceHooks: PieceMetadataServiceHooks = {
    async filterPieces(params) {
        const sortedPieces = sortAndOrderPieces(
            params.sortBy,
            params.orderBy,
            params.pieces,
        )
        
        const userBasedPieces = await filterPiecesBasedUser({
            categories: params.categories,
            searchQuery: params.searchQuery,
            pieces: sortedPieces,
            platformId: params.platformId,
            suggestionType: params.suggestionType,
        })

        const platformEmbeddedBasedPieces = filterPiecesBasedOnEmbedding({
            platformId: params.platformId,
            pieces: userBasedPieces,
        })

        return platformEmbeddedBasedPieces
    },
}

let hooks = defaultPieceHooks

export const pieceMetadataServiceHooks = {
    set(newHooks: PieceMetadataServiceHooks): void {
        hooks = newHooks
    },

    get(): PieceMetadataServiceHooks {
        return hooks
    },
}

export type PieceMetadataServiceHooks = {
    filterPieces(p: FilterPiecesParams): Promise<PieceMetadataSchema[]>
}

export type FilterPiecesParams = {
    includeHidden?: boolean
    platformId?: PlatformId
    searchQuery?: string
    categories?: PieceCategory[]
    projectId?: string
    sortBy?: PieceSortBy
    orderBy?: PieceOrderBy
    pieces: PieceMetadataSchema[]
    suggestionType?: SuggestionType
}
