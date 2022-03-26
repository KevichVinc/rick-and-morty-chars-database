import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store/index";
import { getRMCharacters } from "api";
import { RMCharacter } from "types";

export interface CharactersState {
  status: "idle" | "loading" | "failed";
  charactersList: RMCharacter[];
  page: number;
}

const initialState: CharactersState = {
  status: "idle",
  charactersList: [],
  page: 1,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getCharacters = createAsyncThunk(
  "counter/fetchCount",
  async (page: number) => {
    const { results } = await getRMCharacters(page);

    // The value we return becomes the `fulfilled` action payload
    return results.map((character: RMCharacter) => {
      return {
        ...character,
        isFavorite: false,
      };
    });
  }
);

export const charactersSlice = createSlice({
  name: "characters",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addToFavorite(state, action: PayloadAction<RMCharacter>) {
      state.charactersList = state.charactersList.map((character) => {
        if (action.payload.id === character.id) {
          console.log("found what to like");
          return {
            ...character,
            isFavorite: true,
          };
        }
        return character;
      });
    },
    removeFromFavorite(state, action: PayloadAction<RMCharacter>) {
      state.charactersList = state.charactersList.map((character) => {
        if (action.payload.id === character.id) {
          return {
            ...character,
            isFavorite: false,
          };
        }
        return character;
      });
    },
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getCharacters.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCharacters.fulfilled, (state, action) => {
        const results = action.payload;
        state.status = "idle";
        state.charactersList = [...state.charactersList, ...results];
        state.page += 1;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCharacters = (state: RootState) =>
  state.characters.charactersList;

export const selectFavoriteCharacters = (state: RootState) =>
  state.characters.charactersList.filter(
    (character: RMCharacter) => character.isFavorite
  );

export const selectPage = (state: RootState) => state.characters.page;

export const { addToFavorite, removeFromFavorite } = charactersSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default charactersSlice.reducer;