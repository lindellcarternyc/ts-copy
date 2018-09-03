const main = () => {
  console.log('main')
}

export default (() => {
  console.log('main')
  main()
})