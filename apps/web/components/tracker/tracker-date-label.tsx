type TrackerDateLabelProps = {
  dateLabel: string
}

export function TrackerDateLabel({ dateLabel }: TrackerDateLabelProps) {
  return <span className="text-alt-foreground">{dateLabel}</span>
}
