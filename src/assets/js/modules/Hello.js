export default element => {
  // Module mounted
  console.log('Hello', element)

  return () => {
    // Module unmounted
    console.log('Bye')
  }
}
