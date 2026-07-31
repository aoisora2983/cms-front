export const useJsonLd = () => {
    const graphNodes = useState<Record<string, unknown>[]>(
        'json-ld-graph-nodes',
        () => [],
    )

    /**
     * @graph にノードを追加
     */
    const addJsonLd = (node: Record<string, unknown> | Record<string, unknown>[]) => {
        const nodesToAdd = Array.isArray(node) ? node : [node]

        nodesToAdd.forEach((newNode) => {
            // 重複は除去
            const isDuplicate = graphNodes.value.some((existingNode) => {
                return (
                    (newNode['@type'] && existingNode['@type'] === newNode['@type'])
                    || JSON.stringify(existingNode) === JSON.stringify(newNode)
                )
            })

            if (!isDuplicate) {
                graphNodes.value.push(newNode)
            }
        })
    }

    const clearJsonLd = () => {
        graphNodes.value = []
    }

    return {
        graphNodes,
        addJsonLd,
        clearJsonLd,
    }
}
