export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}
