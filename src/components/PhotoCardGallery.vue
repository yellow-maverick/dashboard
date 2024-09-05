<template>
  <div class='photo-card-container row h-100' >
    <div class=photo-gallery >
      <div class=photo-card v-for='(image, index) in images' :key=index >
        <img :src=image class='img-thumbnail card-img' alt=Thumbnail @click=openModal(image) data-bs-toggle=modal :data-bs-target='`#${id}`' />
      </div>
    </div>

    <!-- Modal -->
    <div v-if=selectedImage class='modal fade' :id=id tabindex=-1 aria-labelledby=imageModalLabel aria-hidden=true >
      <div class='modal-dialog modal-dialog-centered modal-lg'>
        <div class=modal-content >
          <div class=modal-header >
            <button type=button class='btn btn-close' data-bs-dismiss=modal />
          </div>
          <div class='modal-body text-center'>
            <img :src=selectedImage class=img-fluid >
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang=scss >
.photo-gallery {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0;
  width: auto;
  height: 100%;
  overflow: hidden; /* Ensures no overflow of the parent container */
  padding-right: 30px;
}

.photo-card {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 50px;
  max-width: 100%;
  height: 100%;
  margin-right: -20px;
  overflow: hidden;
  z-index: 1;
  transition: transform 0.3s ease, filter 0.3s ease;
}

/* Scale the hovered image */
.photo-card:hover {
  transform: scale(1.5);
  z-index: 10;
}

/* Dim all images that are not hovered */
.photo-card-container:hover .photo-card:not(:hover) {
  filter: brightness(0.5);
}
.card-img {
  width: auto;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

<script>
  export default {
    data() {
      return {
        selectedImage: null,
        id: `imageModal-${Math.random()}`,
      }
    },
    props: ['images'],

    methods: {
      openModal(image) {
        this.selectedImage = image
      },
    },
  }
</script>

