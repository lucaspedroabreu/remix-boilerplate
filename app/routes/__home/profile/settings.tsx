import * as React from "react"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { ActionFunction, Form, LoaderFunction, redirect } from "remix"

import { Tile, TileBody, TileFooter, TileHeader, TileHeading } from "~/components/Tile"
import { db } from "~/prisma/db.server"
import { getCurrentUser, requireUser } from "~/services/auth/auth.service"

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request)
  return {}
}
export const action: ActionFunction = async ({ request }) => {
  const user = await getCurrentUser(request)
  await db.user.delete({ where: { id: user.id } })
  return redirect("/")
}

export default function Settings() {
  const alertProps = useDisclosure()

  const cancelRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Stack spacing={6}>
      <Tile>
        <TileHeader>
          <TileHeading>Danger zone</TileHeading>
        </TileHeader>
        <TileBody>
          <Text fontSize="sm">
            Permanently delete your account and all of its contents from the boilerplate. This action is not
            reversible – please continue with caution.
          </Text>
        </TileBody>
        <TileFooter>
          <Flex w="100%" justify="flex-end">
            <Button size="sm" colorScheme="red" onClick={alertProps.onOpen}>
              Delete account
            </Button>
          </Flex>
          <AlertDialog
            {...alertProps}
            motionPreset="slideInBottom"
            isCentered
            leastDestructiveRef={cancelRef}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete account
                </AlertDialogHeader>
                <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={alertProps.onClose}>
                    Cancel
                  </Button>
                  <Form method="post">
                    <Button colorScheme="red" type="submit" ml={3}>
                      Delete
                    </Button>
                  </Form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </TileFooter>
      </Tile>
    </Stack>
  )
}
