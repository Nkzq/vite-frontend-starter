export default (element: HTMLElement): Function => {
  // Module mounted
  console.log('Hello', element)

  return () => {
    // Module unmounted
    console.log('Bye')
  }
}
