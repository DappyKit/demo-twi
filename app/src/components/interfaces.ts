export interface UserProps {
    id: string
    first_name: string
    last_name: string
    username: string
    tweets: TweetData[]
}

export interface TweetData {
    text: string
    image: string
    image_square: string
}