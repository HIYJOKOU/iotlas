import { useNetwork } from '@/hooks/use-network'
import { getNetworkLabel, isNetwork, NETWORK_OPTIONS } from '@/lib/network'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function NetworkSelect() {
  const { network, setNetwork } = useNetwork()

  return (
    <Select
      value={network}
      onValueChange={(value) => {
        if (value && isNetwork(value)) {
          setNetwork(value)
        }
      }}
    >
      <SelectTrigger className="w-auto min-w-0 gap-1 pr-1.5 font-medium">
        <span className="hidden text-muted-foreground sm:inline">Network:</span>
        <SelectValue>{getNetworkLabel(network)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          {NETWORK_OPTIONS.map((candidateNetwork) => (
            <SelectItem key={candidateNetwork} value={candidateNetwork}>
              {getNetworkLabel(candidateNetwork)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
