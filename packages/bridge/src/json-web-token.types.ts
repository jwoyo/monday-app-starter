export interface MondayJsonWebTokenDecoded {
    exp: number
    dat: {
        client_id: string
        user_id: number
        account_id: number
        slug: string
        app_id: number
        app_version_id: number
        install_id: number
        is_admin: boolean
        is_view_only: boolean
        is_guest: boolean
        user_kind: string
    }
}
export interface MondayIntegrationWebHookJsonWebTokenDecoded {
    accountId: number
    userId: number
    aud: string
    exp: number
    shortLivedToken: string
    iat: number
}
