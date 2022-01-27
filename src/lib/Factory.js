
import { Strip, Item} from "@/components"

export const createPageComponents = (strips) => {
    return strips.map(({title, media_type, items}) => {
        return {type: Strip, itemType: Item, h: Item.height + 80, title, index: 0, items: createItemCollection(items, media_type)}
    });
}

export const createItemCollection = (items, media_type = 'channel') => {
    return items.map((item) => {
        if(item.data.name)
        return {item: applyItemModel({media_type, ...item.data})}
    })
};

export const applyItemModel = (item) => {
    const {_id, category, description, media_type = 'channel', name, genres, language} = item;
    return {
        id : _id,
        media_type,
        category,
        description,
        genres,
        title: media_type === 'tv' ? name : name,
        language,
        large_poster: item.logo.selectedFile,
    }
}

export const applyPlayerModel = (item) => {
    const {_id, name, media_type = 'channel', category, description,  genres, url , video_url} = item;
    return {
        id: _id,
        title: media_type === 'tv' ? name : name,
        // poster: item.logo.selectedFile,
        // large_poster: item.logo.selectedFile,
        // backdrop: item.logo.selectedFile,
        category,
        description,
        genres,
        url, video_url
    }
} 