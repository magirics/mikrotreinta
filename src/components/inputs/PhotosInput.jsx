import { Image, Input, VStack, Wrap } from "@chakra-ui/react"

export default function PhotosInput(props) {
    const { photos } = props.form.values
    const { setFieldValue } = props.form

    return <VStack>
        <Wrap>
            {
                photos.map((t, i) => <SelectedThumbnail key={i} url={
                    typeof t === 'string' ?
                        t :
                        URL.createObjectURL(t)
                } />)
            }
        </Wrap>
        <Input
            type='file'
            multiple
            value=''
            onChange={event => setFieldValue(props.name, Array.from(event.target.files))}
        />
    </VStack>
}

function SelectedThumbnail({ url }) {
    return <Image boxSize='100px' objectFit='contain' src={url} />
}