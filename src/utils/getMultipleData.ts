type DocType = {
  id: string
  data: () => any
}

export default function getMultipleData(data: DocType[]): any[] {
  return data.map((doc) => {
    return { id: doc.id, ...doc.data() }
  })
}
