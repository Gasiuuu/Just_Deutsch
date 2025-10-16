import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFlashcardStore = create(
    persist(
        (set) => ({
            recentSet: null,

            setRecentSet: (categoryId, categoryName, categoryImage, flashcards, lastIndex) =>
                set({
                    recentSet: {
                        categoryId,
                        categoryName,
                        categoryImage,
                        flashcards,
                        lastIndex,
                        timestamp: new Date().getTime(),
                    },
                }),

            updateLastIndex: (index) =>
                set((state) => ({
                    recentSet: state.recentSet ?
                        {...state.recentSet, lastIndex: index, timestamp: new Date().getTime()}
                        : null,
                })),

            clearRecentSet: () => set({recentSet: null}),
        }),
        {
            name: 'flashcard-storage',
        }
    )
)

export default useFlashcardStore