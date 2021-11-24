import shuffle from 'array-shuffle'

const capitalize = (str) => str[0].toUpperCase() + str.slice(1)

export const handler = async () => {
  const parts = shuffle(['ç', 'f', 'r', 'fl', 'ch', 'r'])

  return {
    statusCode: 200,
    body: `${capitalize(parts[0])}a ${parts[1]}ait ${parts[2]}é${parts[3]}é${
      parts[4]
    }i${parts[5]}e`,
  }
}
