import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BookMarkItem from './BookMarkItem';
import { getAllBookmarkedItems } from '@/lib/appwrite';
import LoadingSVG from '@/components/LoadingSVG';
import { useAppContext } from '@/context/AppContext';

const BookMarkPageItems = () => {
  const { refreshTrigger } = useAppContext();
  const [bookMarkItems, setBookMarkItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchBookmarkedItems = async () => {
      try {
        const items = await getAllBookmarkedItems();
        setBookMarkItems(items.documents.reverse());
      } catch (error) {
        console.error("Error fetching bookmarked items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarkedItems();
  }, [refreshTrigger]);

  return (
    <View className='mt-10 flex flex-col gap-y-5'>
      <Text className="text-3xl flex justify-start font-sora text-gray-300 ml-10 mt-5">
        Bookmarks Items
      </Text>
      {isLoading ? (
        <View className="flex items-center justify-center h-[300px]">
          <LoadingSVG />
        </View>
      ) : bookMarkItems.length === 0 ? (
        <View className="flex items-center justify-center h-[550px]">
          <Text className="text-gray-300 font-sora text-2xl">No bookmarked items</Text>
        </View>
      ) : (
        <ScrollView 
          className='flex flex-col gap-x-5'
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ height: '80%' }}
        >
          {bookMarkItems.map((item, index) => (
            <View key={item.transaction_id}>
              <BookMarkItem 
                isTabBookMark={true} 
                Key={index+1} 
                itemId={item.$id} 
                name={item.item_name} 
                price={item.amount} 
                isRemoving={removingItems[item.$id] || false}
                setRemovingItems={setRemovingItems}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BookMarkPageItems;