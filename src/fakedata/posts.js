import { randomId } from "../helpers/randomid";

let posts = [
    {
        id: randomId(),
        comment: `I don't think Manchester City can have such dominance anymore in the upcoming season.
        Everyone seems to get them a little now. Hopefully Arsenal come GUNBLAZING!!!.`,
        image: 'https://assets.goal.com/images/v3/bltee3e9fe91a64c053/UCL_Man_City_vs_Arsenal.jpg?auto=webp&format=pjpg&width=3840&quality=60',
        category: 'Sports',
        author: 'Joe Biden',
        time: '12hrs',
        tag: ['Sports', 'Premier League', 'Champions League'],
        commentcount: 23,
        likes: 23,
        comments: []
    },
    {
        id: randomId(),
        comment: `Love is sweet and i would replace it with nothing. The best thing you can feel`,
        image: 'https://images.pexels.com/photos/58572/pexels-photo-58572.jpeg?cs=srgb&dl=pexels-josh-willink-11499-58572.jpg&fm=jpg',
        category: 'Dating & Relationships',
        author: 'Mark Cuban',
        time: '1hr',
        tag: ['Love', 'Dating', 'Relationships'],
        commentcount: 300,
        likes: 700,
        comments: []
    },
    {
        id: randomId(),
        comment: `Tom Gun ( Maverick ) makes $900 million at the box-office. What a feat!!!`,
        image: 'https://moviesmarkus.com/wp-content/uploads/2022/06/top-gun.jpg',
        category: 'Movies',
        author: 'Tom Cruise',
        time: '3hrs',
        tag: ['Action', 'Movies', 'Oscars'],
        commentcount: 80,
        likes: 400,
        comments: []
    },
    {
        id: randomId(),
        comment: `Lmaooo!!! Messi is washed!!!. Fraud!!!`,
        image: 'https://s.ndtvimg.com/images/content/2014/jul/806/lionel-messi-dejected.jpg',
        category: 'Sports',
        author: 'Peter Drury',
        time: '12hrs',
        tag: ['Sports', 'Premier League', 'La Liga'],
        commentcount: 203,
        likes: 823,
        comments: []
    },
    {
        id: randomId(),
        comment: `Woke up this morning with Zero Zeal!`,
        image: '',
        category: 'Lifestyle',
        author: 'Noah Ife',
        time: '15hrs',
        tag: ['Lifestyle', 'Bants', 'Life'],
        commentcount: 203,
        likes: 823,
        comments: []
    },
    {
        id: randomId(),
        comment: `Davido allegedly Weds Chioma. ALLEGEDLY!!!`,
        image: 'https://netstorage-legit.akamaized.net/images/9e6ef13edc0cd1aa.png?imwidth=900',
        category: 'News',
        author: 'Gbeborun',
        time: '12hrs',
        tag: ['Gists', 'Blogs'],
        commentcount: 193,
        likes: 965,
        comments: []
    },
]

let trending = [
    {
        id: randomId(),
        comment: `Davido allegedly Weds Chioma. ALLEGEDLY!!!`,
        image: 'https://netstorage-legit.akamaized.net/images/9e6ef13edc0cd1aa.png?imwidth=900',
        category: 'News',
        author: 'Gbeborun',
        time: '12hrs',
        tag: ['Gists', 'Blogs'],
        commentcount: 193,
        likes: 965,
        comments: []
    },
    {
        id: randomId(),
        comment: `Tom Gun ( Maverick ) makes $900 million at the box-office. What a feat!!!`,
        image: 'https://moviesmarkus.com/wp-content/uploads/2022/06/top-gun.jpg',
        category: 'Movies',
        author: 'Tom Cruise',
        time: '3hrs',
        tag: ['Action', 'Movies', 'Oscars'],
        commentcount: 80,
        likes: 400
    },
    {
        id: randomId(),
        comment: `Love is sweet and i would replace it with nothing. The best thing you can feel`,
        image: 'https://images.pexels.com/photos/58572/pexels-photo-58572.jpeg?cs=srgb&dl=pexels-josh-willink-11499-58572.jpg&fm=jpg',
        category: 'Dating & Relationships',
        author: 'Mark Cuban',
        time: '1hr',
        tag: ['Love', 'Dating', 'Relationships'],
        commentcount: 300,
        likes: 700,
        comments: []
    },
    {
        id: randomId(),
        comment: `Woke up this morning with Zero Zeal!`,
        image: '',
        category: 'Lifestyle',
        author: 'Noah Ife',
        time: '15hrs',
        tag: ['Lifestyle', 'Bants', 'Life'],
        commentcount: 203,
        likes: 823,
        comments: []
    },
    {
        id: randomId(),
        comment: `I don't think Manchester City can have such dominance anymore in the upcoming season.
        Everyone seems to get them a little now. Hopefully Arsenal come GUNBLAZING!!!.`,
        image: 'https://assets.goal.com/images/v3/bltee3e9fe91a64c053/UCL_Man_City_vs_Arsenal.jpg?auto=webp&format=pjpg&width=3840&quality=60',
        category: 'Sports',
        author: 'Joe Biden',
        time: '12hrs',
        tag: ['Sports', 'Premier League', 'Champions League'],
        commentcount: 23,
        likes: 23,
        comments: []
    },
    {
        id: randomId(),
        comment: `Lmaooo!!! Messi is washed!!!. Fraud!!!`,
        image: 'https://s.ndtvimg.com/images/content/2014/jul/806/lionel-messi-dejected.jpg',
        category: 'Sports',
        author: 'Peter Drury',
        time: '12hrs',
        tag: ['Sports', 'Premier League', 'La Liga'],
        commentcount: 203,
        likes: 823,
        comments: []
    },
]

export function getFeaturedPosts(){
    return posts;
}

export function getTrendingPosts(){
    return trending;
}

export function getPost(id) {
    return posts.find( post => post.id === id) || trending.find( post => post.id === id)
}